import { useState } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";

export default function ExpenseForm({ onExpenseAdded }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    category: "Other",
    description: "",
    receipt: null,
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("upload");
  const [extracted, setExtracted] = useState({
    title: "",
    amount: "",
    date: "",
    category: "Other",
  });
  const [ocrText, setOcrText] = useState("");

  function formatDateForInput(ocrDate) {
    if (!ocrDate) return "";
    const parts = ocrDate.split(/[\/\-]/);
    if (parts.length !== 3) return "";

    let day, month, year;
    if (parseInt(parts[0]) > 12) {
      [day, month, year] = parts;
    } else {
      [month, day, year] = parts;
    }

    if (year.length === 2) year = "20" + year;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.receipt) return alert("Please upload a receipt image first.");

    setLoading(true);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(form.receipt, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.floor(m.progress * 100));
          }
        },
      });

      const text = result.data.text || "";
      setOcrText(text);

      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      const title = lines.find((l) => !/\d/.test(l)) || "Receipt";
      const amounts = [...text.matchAll(/(\d+(\.\d{2}))/g)].map((m) => m[0]);
      const amount = amounts.length ? amounts[amounts.length - 1] : "";
      const dateMatch = text.match(
        /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/
      );
      const date = dateMatch ? formatDateForInput(dateMatch[0]) : "";

      let aiData = {};
      try {
        const aiRes = await axios.post("/api/expenses/categorize", { text });
        aiData = aiRes.data;
      } catch (err) {
        console.error("⚠️ AI categorization failed:", err);
      }

      const extractedData = {
        title: aiData.title || title,
        amount: aiData.amount || amount,
        date: aiData.date || date,
        category: aiData.category || "Other",
      };

      setExtracted(extractedData);
      setForm((prev) => ({ ...prev, ...extractedData }));
      setStep("review");
    } catch (err) {
      console.error("❌ OCR failed:", err);
      alert("Failed to extract text. Please try again.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.date || !form.category) {
      return alert("Please fill all required fields.");
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/expenses", {
        title: form.title,
        amount: form.amount,
        date: form.date,
        category: form.category,
        description: form.description,
      });

      if (onExpenseAdded) onExpenseAdded(res.data.expense);

      setStep("saved");
      setTimeout(() => {
        setForm({
          title: "",
          amount: "",
          date: "",
          category: "Other",
          description: "",
          receipt: null,
        });
        setExtracted({ title: "", amount: "", date: "", category: "Other" });
        setOcrText("");
        setStep("upload");
      }, 1500);
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("Failed to save expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "receipt") {
      setForm({ ...form, receipt: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  return (
    <form
      onSubmit={step === "upload" ? handleUpload : handleSave}
      className="space-y-6 bg-white/70 backdrop-blur-md border border-gray-200/60 p-6 rounded-2xl shadow-md"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Smart Expense Capture
        </h2>
        <p className="text-gray-600">
          Upload your receipt and let our AI handle the details.
        </p>
      </div>

      {/* How It Works */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800">
        <h3 className="font-semibold mb-1">📸 Upload a Receipt</h3>
        <p className="text-sm leading-relaxed">
          Simply take a photo of your receipt and let our{" "}
          <span className="font-medium">AI</span>
          extract all the details automatically. <br />
          <span className="text-gray-700">
            No manual typing required — review & save in one click!
          </span>
        </p>
      </div>

      {/* Review Mode */}
      {step === "review" && (
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-semibold mb-3 text-gray-800">
              Extracted (OCR + AI)
            </h4>
            <p>
              <span className="font-medium">Title:</span>{" "}
              {extracted.title || "-"}
            </p>
            <p>
              <span className="font-medium">Amount:</span>{" "}
              {extracted.amount || "-"}
            </p>
            <p>
              <span className="font-medium">Date:</span> {extracted.date || "-"}
            </p>
            <p>
              <span className="font-medium">Category:</span>{" "}
              {extracted.category || "-"}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Your Edit</h4>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Expense Title"
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 mb-2"
              required
            />
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 mb-2"
              required
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-400 mb-2"
              required
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-400 mb-2"
              required
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      )}

      {/* Upload Mode */}
      {step === "upload" && (
        <input
          type="file"
          name="receipt"
          accept="image/*"
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer"
          required
        />
      )}

      {/* Progress */}
      {loading && step === "upload" && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-500 h-2 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        {loading
          ? step === "upload"
            ? `Processing OCR ${progress}%`
            : "Saving..."
          : step === "upload"
          ? "Upload & Extract"
          : "Save Expense"}
      </button>

      {step === "saved" && (
        <p className="text-green-600 font-semibold mt-2 text-center">
          ✅ Expense saved!
        </p>
      )}

      {/* Debug OCR text */}
      {ocrText && step === "review" && (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-indigo-600">
            View raw OCR text
          </summary>
          <pre className="text-xs bg-gray-100 text-gray-700 p-3 rounded-xl mt-2 max-h-40 overflow-y-auto">
            {ocrText}
          </pre>
        </details>
      )}
    </form>
  );
}
