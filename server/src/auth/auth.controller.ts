import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

import { User } from 'src/user/enteties/user.entity';
import { RegisterDTO } from './dto/register.dto';
import { AccessTokenGuard } from 'src/guards/at.guard';
import { RefreshTokenGuard } from 'src/guards/rt.guard';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
}
