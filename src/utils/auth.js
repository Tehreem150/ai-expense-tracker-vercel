import jwt from "jsonwebtoken";

export const verifyToken = (req) => {
  try {
    const token = req.cookies?.token;
    if (!token) return null;

    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
