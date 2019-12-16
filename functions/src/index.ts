import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

interface incomingMessage {
  content: string;
}

/**
 * To set these vars, run:
 * firebase functions:config:set gmail.email="myusername@gmail.com" gmail.password="secretpassword"
 */
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

export const sendToInbox = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST' || !req.body || !req.body.content) {
    return res.status(403).send('Forbidden!');
  }

  const message: incomingMessage = req.body;

  try {
    const isMessageSent = await sendMessage(message.content);

    if (isMessageSent.err) {
      console.error(isMessageSent);
      return res.status(500).send('SMTP error :(');
    }
    return res.status(200).send('Success!');
  } catch (e) {
    console.error(e);
    return res.status(500).send('Internal server error :(');
  }
});

function sendMessage(content: string) {
  const mailOptions = {
    from: `Send To Inbox App <vladimir.hooke@gmail.com>`,
    to: gmailEmail,
    subject: content.substring(0, 50),
    text: content,
  };

  return mailTransport.sendMail(mailOptions);
}
