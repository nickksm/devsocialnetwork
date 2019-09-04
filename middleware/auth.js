const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  //get the token from header
  const token = req.header("x-auth-token");

  //check if no token
  if (!token) {
    return res
      .status(401)
      .json({ msg: "No token detected, authorization denied" });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    console.log(decoded);
    /* { user: { id: '5d65583b6301ff39708ddee4' },
        iat: 1566922811,
        exp: 1567282811 } */

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token not valid" });
  }
};
