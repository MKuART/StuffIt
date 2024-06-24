import "dotenv/config";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export function issueJwt(user) {
  const payload = {
    id: user._id,
    role: user.role
  };
  
  return jwt.sign(payload, jwtSecret);
}

export function verifyToken(req, res, next) {
  const token = req.cookies.jwt;
  
  if (!token) {
    const error = new Error("Token not found!");
    error.statusCode = 404;
    next(error);
  }
  console.log(token);
  jwt.verify(token, jwtSecret, (error, decoded) => {
    if (error) {
      error.statusCode = 404;
      next(error);
    }
    req.user = decoded;
    next();
  });
}
