const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");
const ses = new aws.SES({ region: "eu-west-1" });

module.exports = (req, res) => {
  const { message, email } = req.body;

  if (!message || !email) {
    res.sendStatus(403);
    console.error("No email or message provided ", req.body);
    return;
  }
  jwt.verify(req.token, process.env.SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
      console.error("Wrong token ", err);
      return;
    }

    try {
      await sendEmail(email, message);
      res.status(200).json({
        success: true,
        email,
        message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error,
        email,
        message,
      });
    }
  });
};

function sendEmail(email, message) {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: { Data: message },
      },

      Subject: { Data: JSON.stringify(message.substring(0, 30) + "...") },
    },
    Source: "no-reply@hooke.dev",
  };

  return new Promise((resolve, reject) => {
    ses.sendEmail(params, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(data);
        resolve(data);
      }
    });
  });
}
