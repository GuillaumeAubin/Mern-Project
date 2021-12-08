const getUserIDByToken = require("../utils/decodeToken");

module.exports = (req, res, next) => {
  const userId = req.body.userId;
  const authorization = req.headers.authorization;
  
  try {
    if (!authorization) throw "No user logged in";
    if (userId && userId !== getUserIDByToken(req)) throw "Invalid user ID";

    next();
  } catch (err) {
    res.status(401).send({
      message: err || "Token invalid",
    });
  }
};
