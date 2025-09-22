import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Missing text in request body" });
    }

    // 🔹 Stronger AI instruction
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expense categorization assistant.
Extract the following fields from the receipt text:

- title: Store or merchant name (short, e.g. "Walmart", "Amazon", "Supermarket")
- amount: Total bill in numbers ONLY (no currency, no commas, e.g. 423.25)
- date: Date of transaction in YYYY-MM-DD format
- category: Choose ONLY from: ["Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Other"]

Return ONLY valid JSON in this format:
{
  "title": "...",
  "amount": 0,
  "date": "...",
  "category": "..."
}
`,
        },
        { role: "user", content: text },
      ],
      temperature: 0,
    });

    let result = {};
    try {
      result = JSON.parse(response.choices[0].message.content);

      // ✅ sanitize amount
      if (result.amount !== undefined) {
        const cleaned = String(result.amount)
          .replace(/,/g, "") // remove commas
          .replace(/[^\d.\-]/g, ""); // remove currency or junk
        result.amount = parseFloat(cleaned) || 0;
      } else {
        result.amount = 0;
      }
    } catch (e) {
      console.error("❌ JSON parse error:", e);
      result = { title: text.substring(0, 20), amount: 0, category: "Other" };
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Categorization API Error:", error);

    return res.status(500).json({
      message: "Failed to categorize expense",
      error: error.message,
    });
  }
}
