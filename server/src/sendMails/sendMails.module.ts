import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SendMailsService } from './sendMails.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get<string>('SMTP_DEFAULT_MAIL'),
        },
      }),
    }),
  ],
  exports: [SendMailsService],
  providers: [SendMailsService],
})
export class SendMailsModule {}
