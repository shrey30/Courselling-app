const jwt = require("jsonwebtoken");

function adminMiddleware(req, res, next) {
  const { token } = req.headers;
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    if (decoded) {
      req.adminId = decoded.adminId;
      next();
    }
  } catch (e) {
    res.status(401).json({
      message: "Authentication error",
    });
  }
}

module.exports = {
  adminMiddleware,
};
