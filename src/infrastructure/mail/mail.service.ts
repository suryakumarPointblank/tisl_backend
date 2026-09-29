import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Logger } from '../../common/utils/logger';

export interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger('MailService');
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: this.config.get<number>('SMTP_PORT'),
      secure: this.config.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASSWORD'),
      },
    });
    this.from = this.config.get<string>('MAIL_FROM');
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    this.logger.log('Sending email', { to: options.to, subject: options.subject });
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
    } catch (error) {
      this.logger.error('Failed to send email', error?.stack, { to: options.to, subject: options.subject });
      throw error;
    }
  }

  /**
   * Notifies the general TISL inbox (GENERAL_INQUIRY_NOTIFICATION_EMAIL) about a CTA submission.
   * Never throws: the submission is already saved, so a mail failure is only logged.
   */
  async notifyGeneral(subject: string, fields: Record<string, string | number | boolean | null | undefined>): Promise<void> {
    const to = this.config.get<string>('GENERAL_INQUIRY_NOTIFICATION_EMAIL');
    try {
      await this.sendMail({
        to,
        subject,
        text: Object.entries(fields)
          .map(([label, value]) => `${label}: ${value ?? '-'}`)
          .join('\n'),
      });
    } catch {
      // Failure is already logged in sendMail.
    }
  }
}
