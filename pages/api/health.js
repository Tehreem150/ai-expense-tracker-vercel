import { dbConnect } from "../../src/utils/db";

export default async function handler(req, res) {
  try {
    await dbConnect();
    res.status(200).json({ status: "ok", message: "Backend connected to DB ✅" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}
