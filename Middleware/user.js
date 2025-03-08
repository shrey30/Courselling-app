const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
  const token = req.headers;
  console.log(token);
  const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
  if (decoded) {
    req.userId = decoded.userId;
    console.log(req.userId);
    next();
  } else {
    return res.status(403).json({
      message: "Signin unsuccessful",
    });
  }
}

module.exports = {
  userMiddleware,
};
