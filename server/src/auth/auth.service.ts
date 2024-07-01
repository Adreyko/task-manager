/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/user/users.service';

import {
  AuthErrors,
  LoginErrors,
  BadPassword,
} from 'src/shared/consts/errorMessages';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/user/enteties/user.entity';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { Token } from './enteties/refreshToken.entity';
import { ConfigService } from '@nestjs/config';
import { SendMailsService } from 'src/sendMails/sendMails.service';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { ResetToken } from './enteties/resetToken.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    @InjectRepository(ResetToken)
    private resetTokenRepository: Repository<ResetToken>,
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private sendMail: SendMailsService
  ) {}

  async create(data: RegisterDTO): Promise<User> {
    const { email, password, username } = data;

    try {
      const isEmailUsing = await this.userRepository.findOne({
        where: { email: email },
      });

      const isUserNameUsing = await this.userRepository.findOne({
        where: { username: username },
      });

      if (isEmailUsing) {
        throw new HttpException(AuthErrors.emailExist, HttpStatus.FORBIDDEN);
      }

      if (isUserNameUsing) {
        throw new HttpException(AuthErrors.usernameExist, HttpStatus.FORBIDDEN);
      }

      const hashPass = await this.hasPassword(password);

      const dataToSave = {
        ...data,
        isVerified: false,
        password: hashPass,
      };

      await this.userRepository.create(dataToSave);
      await this.sendMail.sendActivationMail(
        email,
        `${this.configService.get('HOST')}/activation/${email}`
      );
      return await this.userRepository.save(dataToSave);
    } catch (error) {
      return error;
    }
  }

  async hasPassword(pass: string) {
    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(pass, salt);
    return hashPass;
  }

  async comparePassword(pass: string, hash: string) {
    return await bcrypt.compare(pass, hash);
  }

  async login(data: LoginDTO) {
    const { email, username, password } = data;

    let user: User;

    if (email) {
      user = await this.validateUser({ email: email }, password);
    }

    if (username) {
      user = await this.validateUser({ username: username }, password);
    }

    if (user) {
      const token = await this.getTokens(user.id, user.username);
      const savedToken = await this.refreshTokenHandler(
        token.refreshToken,
        user.id
      );
      const userData = {
        email: user.firstName,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        id: user.id,
      };

      const resetToken = await this.resetTokenRepository.findOne({
        where: { userId: user.id },
      });
      if (resetToken) await this.resetTokenRepository.delete(resetToken.id);

      return { user: userData, ...token, refreshToken: savedToken.token };
    }
  }
  async validateUser(
    field: { username?: string; email?: string },
    pass: string
  ): Promise<User> {
    const user = await this.userService.findOneBy(field);
    if (!user) {
      throw new HttpException(LoginErrors, HttpStatus.NOT_FOUND);
    }

    const isPasswordCorrect = await this.comparePassword(pass, user.password);
    if (!isPasswordCorrect) {
      throw new HttpException(BadPassword, HttpStatus.NOT_ACCEPTABLE);
    }
    return user;
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1d',
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokenHandler(refreshToken: string, userId: number) {
    const token = await this.tokenRepository.findOne({
      where: { userId: userId },
    });

    if (!token) {
      await this.tokenRepository.create({
        token: refreshToken,
        userId: userId,
      });
      return await this.tokenRepository.save({
        token: refreshToken,
        userId: userId,
      });
    }

    await this.tokenRepository.update(token.id, {
      ...token,
      token: refreshToken,
    });
    return await this.tokenRepository.save({
      ...token,
      toke: refreshToken,
    });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findOneBy({ id: userId });
    const refreshTokenData = await this.tokenRepository.findOne({
      where: { userId: userId, token: refreshToken },
    });

    if (!user || !refreshTokenData) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.username);
    await this.refreshTokenHandler(tokens.refreshToken, userId);
    return tokens;
  }

  async logout(userId: number) {
    return await this.tokenRepository.delete(userId);
  }

  async activate(email: string) {
    const user = await this.userService.findOneBy({ email: email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.update(user.id, { isVerified: true });
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async verifyPasswordReset(email: string, key: string) {
    const user = await this.userService.findOneBy({ email: email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const token = await this.resetTokenRepository.findOne({
      where: { token: key },
    });

    if (!token) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
    return token;
  }

  async sendResetPasswordMail(email: string) {
    const user = await this.userService.findOneBy({ email: email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const tokenExist = await this.resetTokenRepository.findOne({
      where: { userId: user.id },
    });

    if (tokenExist) {
      await this.resetTokenRepository.delete(tokenExist.id);
    }
    const token = uuidv4();

    const tokenData = { token, userId: user.id };
    await this.resetTokenRepository.create(tokenData);
    await this.resetTokenRepository.save(tokenData);

    const link = `${this.configService.get('HOST')}/verifyPasswordReset/${email}/${token}`;

    return await this.sendMail.sendResetPasswordMail(email, link);
  }

  async resetPassword(newPassword: { newPassword: string }, token: string) {
    const verifiedToken = await this.resetTokenRepository.findOne({
      where: { token: token },
    });

    if (!verifiedToken) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userService.findOneBy({ id: verifiedToken.userId });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newHashPassword = await this.hasPassword(newPassword.newPassword);
    return await this.userService.updatedPassword(user.id, newHashPassword);
  }
}
