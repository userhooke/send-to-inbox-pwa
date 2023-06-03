const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { email, key } = req.body;

  if (!email) {
    res.status(403).json({ error: "No email provided" });
    console.log("No email provided", req.body);
    return;
  }

  if (!key || key !== process.env.KEY) {
    res.status(403).json({ error: "Wrong key" });
    console.log("Wrong key", req.body);
    return;
  }

  jwt.sign({ email }, process.env.SECRET, (err, token) => {
    res.json({
      token,
    });
  });
};
