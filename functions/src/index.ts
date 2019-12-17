import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
const cors = require('cors')({ origin: true });

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

export const sendToInbox = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (!req.body?.data?.content) {
      return res.status(403).send({ data: { error: 'Forbidden!' } });
    }

    return await handlePost(req.body.data, res);
  });
});

async function handlePost(message: incomingMessage, res: functions.Response) {
  try {
    const isMessageSent = await sendMessage(message.content);

    if (isMessageSent.err) {
      console.error(isMessageSent);
      return res.status(500).send({ data: { error: 'SMTP error :(' } });
    }
    return res.status(200).send({ data: { success: true } });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .send({ data: { error: 'Internal server error :(' } });
  }
}

function sendMessage(content: string) {
  const mailOptions = {
    from: `Send To Inbox App <vladimir.hooke@gmail.com>`,
    to: gmailEmail,
    subject: content.substring(0, 50) + '...',
    text: content,
  };

  return mailTransport.sendMail(mailOptions);
}
