module.exports = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    res.sendStatus(403);
    return;
  };
  // Split at the space
  const [bearer, token] = bearerHeader.split(" ");
  // Set the token
  req.token = token;
  // Next middleware
  next();
};
