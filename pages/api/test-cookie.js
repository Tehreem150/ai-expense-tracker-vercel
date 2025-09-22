import { serialize } from "cookie";

export default function handler(req, res) {
  const token = "test-token";

  res.setHeader(
    "Set-Cookie",
    serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
  );

  res.status(200).json({ message: "Cookie set successfully" });
}
