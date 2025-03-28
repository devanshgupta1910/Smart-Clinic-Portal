import { useState } from "react";

export default function UploadReport() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("report", file);

    try {
      const response = await fetch("http://localhost:5000/api/reports/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Report uploaded successfully!");
        setFile(null);
      } else {
        alert("Upload failed. Try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Upload Medical Report</h1>
      <input
        type="file"
        className="mt-4 border p-2"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded mt-4"
      >
        Upload
      </button>
    </div>
  );
}
