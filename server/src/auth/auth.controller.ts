import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

import { User } from 'src/user/enteties/user.entity';
import { RegisterDTO } from './dto/register.dto';
import { AccessTokenGuard } from 'src/guards/at.guard';
import { RefreshTokenGuard } from 'src/guards/rt.guard';
import { ConfigService } from '@nestjs/config';

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService
  ) {}
  @Post('auth')
  @HttpCode(HttpStatus.OK)
  async create(@Body() user: RegisterDTO): Promise<User> {
    return await this.authService.create(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: RegisterDTO): Promise<{ accessToken: string }> {
    return await this.authService.login(user);
  }
  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@Req() req: Request): Promise<any> {
    return await this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('activation/:email')
  async activate(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.activate(req.params.email);
    if (user) {
      throw new HttpException(
        'User already activated',
        HttpStatus.UNAUTHORIZED
      );
    }
    res.redirect(`${this.configService.get('CLIENT_URL')}/login`);
    return user;
  }

  @Post('sendResetPasswordMail')
  async setResetPasswordMail(@Body() email: { email: string }) {
    return await this.authService.sendResetPasswordMail(email.email);
  }

  @Get('verifyPasswordReset/:email/:token')
  async reset(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.verifyPasswordReset(
      req.params.email,
      req.params.token
    );
    if (!token) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    res.redirect(
      `${this.configService.get('CLIENT_URL')}/change-password?key=${token.token}`
    );
  }

  @Post('resetPassword/:token')
  async resetPassword(
    @Req() req: Request,
    @Body() newPassword: { newPassword: string }
  ) {
    return this.authService.resetPassword(newPassword, req.params.token);
  }
}
