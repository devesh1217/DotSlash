// pages/admin.js (Admin Page UI with PDF Generation & Digital Signature)
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

export default function AdminPage() {
  const [pendingDocs, setPendingDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPendingDocs() {
      const res = await axios.get("/api/documents/pending");
      setPendingDocs(res.data);
    }
    fetchPendingDocs();
  }, []);

  const generatePDF = async (docId) => {
    try {
      const res = await axios.get(`/api/documents/details/${docId}`);
      const { name, address, dob, documentName } = res.data;
      
      const doc = new jsPDF();
      doc.text("Document Verification", 20, 20);
      doc.text(`Name: ${name}`, 20, 40);
      doc.text(`Address: ${address}`, 20, 60);
      doc.text(`Date of Birth: ${dob}`, 20, 80);
      doc.text(`Document: ${documentName}`, 20, 100);
      doc.text("Verified and Digitally Signed", 20, 120);
      
      const pdfBlob = doc.output("blob");
      const formData = new FormData();
      formData.append("file", pdfBlob, `${documentName}.pdf`);
      formData.append("docId", docId);
      
      await axios.post("/api/documents/upload", formData);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    }
  };

  const handleVerify = async (docId) => {
    setLoading(true);
    try {
      await generatePDF(docId);
      const res = await axios.post("/api/documents/verify", { docId });
      alert(res.data.message);
      setPendingDocs(pendingDocs.filter((doc) => doc.id !== docId));
    } catch (error) {
      console.error("Verification Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Admin Document Verification</h1>
      {pendingDocs.length === 0 ? (
        <p>No pending documents</p>
      ) : (
        <ul>
          {pendingDocs.map((doc) => (
            <li key={doc.id} className="flex justify-between items-center border-b py-2">
              <span>{doc.id}</span>
              <button
                onClick={() => handleVerify(doc.id)}
                className="bg-blue-500 text-white px-4 py-1 rounded"
                disabled={loading}
              >
                {loading ? "Processing..." : "Verify & Generate Signed PDF"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
