import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendMailsService {
  constructor(
    private readonly mailService: MailerService,
    private configService: ConfigService
  ) {}

  async sendMail({
    client,
    mailTitle,
    mailContent,
  }: {
    client: string;
    mailTitle: string;
    mailContent: any;
  }) {
    try {
      await this.mailService.sendMail({
        to: client,
        subject: mailTitle,
        sender: this.configService.get('SMTP_USER'),
        text: '',
        html: mailContent,
      });
    } catch (error) {
      throw new HttpException(
        `Error: ${JSON.stringify(error)}`,
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }

  async sendActivationMail(client, link) {
    await this.sendMail({
      client,
      mailTitle: 'Activation mail',
      mailContent: `
      <div>
        <h1>Activation mail</h1>
        <p>Click the link below to activate your account</p>
        <a href=${link}>Activate</a>
      </div>`,
    });
  }
  async sendResetPasswordMail(client, link) {
    await this.sendMail({
      client,
      mailTitle: 'Reset password',
      mailContent: `
      <div>
        <h1>Reset password</h1>
        <p>Click the link below to change your password</p>
        <a href=${link}>Change password</a>
      </div>`,
    });
  }
}
