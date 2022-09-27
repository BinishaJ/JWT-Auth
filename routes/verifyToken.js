const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  //store and check for token
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied");
  try {
    //verify token
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
