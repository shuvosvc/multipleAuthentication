const jwt = require("jsonwebtoken");
const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userName, userId, userRoll } = decoded;
    req.userName = userName;
    req.userId = userId;
    req.userRoll = userRoll;

    next();
  } catch {
    next("Authentication failed!m");
  }
};
module.exports = checkLogin;
