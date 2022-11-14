import { createTransport } from 'nodemailer';

import { configurations } from '../../../infrastructure/configurations/index';

export type EmailMessage = {
  from: string;
  to: any[];
  subject: string;
  replyTo?: string;
  html?: string;
  text: string;
  attachments?: any[];
};
export const NodeMailServiceAdapter = async (options: {
  description?: string;
  html: string;
  subject: string;
  to: any[];
  attachments?: any[];
}) => {
  const { attachments, to, html, subject, description } = { ...options };

  const transporter = createTransport({
    host: configurations.implementations.mailSMTP.host,
    port: configurations.implementations.mailSMTP.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: configurations.implementations.mailSMTP.user, // generated ethereal user
      pass: configurations.implementations.mailSMTP.pass, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions: EmailMessage = {
    from: `${configurations.datasite.name} ${configurations.implementations.awsSMTP.email}`, // sender address
    to,
    subject: subject,
    text: description,
    html: html,
    attachments,
  };

  await transporter.sendMail(mailOptions);
};
