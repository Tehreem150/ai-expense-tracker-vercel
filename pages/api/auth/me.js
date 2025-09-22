import dbConnect from "../../../src/utils/db";
import User from "../../../src/models/User";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default async function handler(req, res) {
  try {
    await dbConnect();

    // Parse cookies
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
