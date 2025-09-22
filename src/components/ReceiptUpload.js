import { useState } from "react";
import axios from "axios";

export default function ReceiptUpload({ onExtracted }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a file");

    setLoading(true);
    setError("");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;

        const response = await axios.post("/api/expenses/upload", { file: base64 });
        onExtracted(response.data.text); // send OCR text to parent
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setError("Failed to extract text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Extracting..." : "Upload & Extract"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
