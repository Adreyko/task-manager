import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { User } from 'src/user/enteties/user.entity';
import { UsersService } from './users.service';
// import { AuthGuard } from 'src/guards/auth.guard';

@Controller('api')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  // @UseGuards(AuthGuard)
  @Get('users')
  @HttpCode(HttpStatus.OK)
  async getAuthUser(
    @Body() field: { username?: string; email?: string },
  ): Promise<User | undefined> {
    return await this.userService.findOneBy(field);
  }
}
