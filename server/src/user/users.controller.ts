import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/guards/at.guard';
// import { AuthGuard } from 'src/guards/auth.guard';

@Controller('api')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @UseGuards(AccessTokenGuard)
  @Get('user')
  @HttpCode(HttpStatus.OK)
  async getAuthUser(@Req() req: Request) {
    const userId = req.user['sub'];

    return await this.userService.findUserById(userId);
  }
}
