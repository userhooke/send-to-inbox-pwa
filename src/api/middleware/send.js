const jwt = require("jsonwebtoken");

module.exports = (req, res) => {
  jwt.verify(req.token, process.env.SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    res.json({
      message: "Email sent",
      authData,
    });
  });
};
