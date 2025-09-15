import dbConnect from "../../../src/utils/db";
import User from "../../../src/models/User";
import bcrypt from "bcryptjs";

console.log("🚀 register.js API hit");

export default async function handler(req, res) {
  console.log("METHOD:", req.method);
  console.log("BODY:", req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    console.log("✅ DB connected");

    const { name, email, password } = req.body;
    console.log("DATA RECEIVED:", name, email);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Hide password in response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    return res
      .status(201)
      .json({ message: "User registered successfully", user: userResponse });
  } catch (error) {
    console.error("❌ ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
}
