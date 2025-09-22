import dbConnect from "@/src/utils/db";
import User from "@/src/models/User";
import { verifyToken } from "@/src/utils/auth";

export default async function handler(req, res) {
  await dbConnect();

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    if (req.method === "GET") {
      const foundUser = await User.findById(user.id).select(
        "currency preferences"
      );
      return res.json(foundUser);
    }

    if (req.method === "PUT") {
      const { currency, preferences } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        {
          currency,
          preferences,
        },
        { new: true }
      ).select("currency preferences");

      return res.json(updatedUser);
    }

    res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error("❌ Error updating settings:", err);
    res.status(500).json({ message: "Server error" });
  }
}
