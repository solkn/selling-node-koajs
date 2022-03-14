import { createTransport } from 'nodemailer';
import { logError } from './logger';
import * as config from 'config';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import { TransformOptions } from 'stream';

const transport = createTransport({
  service: 'gmail',
  auth: config.get<SMTPTransport.AuthenticationType>('gmail')
} as TransformOptions);

export const sendEmail = (to: string, subject: string, body: string) => {
  transport.sendMail({
    from: 'no-reply@optimumlevel.com',
    to,
    subject,
    text: body
  }, (err) => {
    if (err) {
      logError(err);
    }
  });
};
