import { useState } from 'react';
import CryptoJS from 'crypto-js';

export default function Blockchain() {
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState('');
  const [hashedValue, setHashedValue] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    // Generate a unique document ID
    const id = generateDocumentId(selectedFile);
    setDocumentId(id);
  };

  const generateDocumentId = (file) => {
    // Use file name, size, and timestamp to create a unique ID
    const timestamp = Date.now();
    return `${file.name}-${file.size}-${timestamp}`;
  };

  const handleHashDocument = () => {
    if (!documentId) {
      alert('Please upload a document first.');
      return;
    }

    // Hash the document ID using SHA-256
    const hash = CryptoJS.SHA256(documentId).toString(CryptoJS.enc.Hex);
    setHashedValue(hash);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Blockchain Mimic: Hash Document ID</h1>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleHashDocument}
        style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}
      >
        Hash Document ID
      </button>
      {documentId && (
        <div style={{ marginTop: '20px' }}>
          <h2>Document ID:</h2>
          <p style={{ wordWrap: 'break-word' }}>{documentId}</p>
        </div>
      )}
      {hashedValue && (
        <div style={{ marginTop: '20px' }}>
          <h2>Hashed Document ID:</h2>
          <p style={{ wordWrap: 'break-word' }}>{hashedValue}</p>
        </div>
      )}
    </div>
  );
}