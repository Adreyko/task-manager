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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
        password: hashPass,
      };

      await this.userRepository.create(dataToSave);
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
        user.id,
      );
      const userData = {
        email: user.firstName,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        id: user.id,
      };

      return { user: userData, ...token, refreshToken: savedToken.token };
    }
  }
  async validateUser(
    field: { username?: string; email?: string },
    pass: string,
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
          expiresIn: 10,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
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
}
