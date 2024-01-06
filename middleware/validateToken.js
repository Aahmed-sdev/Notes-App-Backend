const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {checkAuthRequired} = require("./apiSecurityExclusion")

const validateToken = asyncHandler(async (req, res, next) => {
  if(!checkAuthRequired(req.path)){
    console.info("Api auth not required for :"+req.path);
    next();
    return;
  }
  console.info("Validating JWT token for Api : "+req.path);

  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    console.error("User is not authorized or token is missing");
    return res.status(401).send();
  }
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
      if (err) {
        console.error(`User is not authorized\nmessage = ${err.message}`);
        return res.status(401).send();
      }
  
      req.user = decoded.user;
      next();
    });
  } catch (error) {
    console.log(error)
    return res.status(500).send();
  }
  
});

module.exports = validateToken;