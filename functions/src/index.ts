import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
import * as express from 'express';
import { sendMessage } from './sending-handler';
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const app = express();

/**
 * To set these vars, run:
 * firebase functions:config:set gmail.email="myusername@gmail.com" gmail.password="secretpassword"
 */
const gmailEmail = functions.config().gmail?.email;
const gmailPassword = functions.config().gmail?.password;

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req: any, res: any, next: any) => {
  console.log('Check if request is authorized with Firebase ID token');

  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)
  ) {
    console.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.',
    );
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized');
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.post('/', async (req, res) => {
  if (!req.body?.data?.content) {
    return res.status(403).send({ data: { error: 'Forbidden!' } });
  }

  try {
    const isMessageSent = await sendMessage(
      gmailEmail,
      gmailPassword,
      req.body.data.content,
    );

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
});

export const sendToInbox = functions.https.onRequest(app);
