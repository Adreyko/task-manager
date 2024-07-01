import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from 'src/user/users.service';
import { User } from 'src/user/enteties/user.entity';
import { Token } from './enteties/refreshToken.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/strategies/at-strategy';
import { RefreshTokenStrategy } from 'src/strategies/rt-strategy';
import { SendMailsService } from 'src/sendMails/sendMails.service';
import { SendMailsModule } from 'src/sendMails/sendMails.module';
import { ResetToken } from './enteties/resetToken.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token, ResetToken]),
    JwtModule.register({}),
    SendMailsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,

    AccessTokenStrategy,
    RefreshTokenStrategy,
    SendMailsService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
