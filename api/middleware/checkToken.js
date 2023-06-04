module.exports = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    res.sendStatus(403);
    return;
  }
  const [bearer, token] = bearerHeader.split(" ");
  if (!token) {
    res.sendStatus(403);
    return;
  }
  req.token = token;
  next();
};
