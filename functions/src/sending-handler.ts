import { createTransport } from 'nodemailer';

export function sendMessage(
  gmailEmail: string,
  gmailPassword: string,
  content: string,
) {
  const mailTransport = createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPassword,
    },
  });

  const mailOptions = {
    from: `Send To Inbox App`,
    to: gmailEmail,
    subject: content.substring(0, 50) + '...',
    text: content,
  };

  return mailTransport.sendMail(mailOptions);
}
