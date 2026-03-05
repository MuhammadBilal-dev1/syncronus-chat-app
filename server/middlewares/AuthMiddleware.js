import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send("You are not authentiated!");
  }
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) {
      res.status(403).send("Token is Invalid");
    }
    req.userId = payload.userId;
    next();
  });
};
