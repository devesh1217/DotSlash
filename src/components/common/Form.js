"use client"
import React, { useState } from 'react';
import FileUpload from './FileUpload';

export default function TestForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    files: []
  });

  const handleUploadSuccess = (uploadedFiles) => {
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...uploadedFiles]
    }));
  };

  const handleUploadError = (error) => {
    alert('Upload failed: ' + error.message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="test-form">
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="form-group">
        <label>Upload Files:</label>
        <FileUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          accept="image/*,application/pdf"
          multiple={true}
          className="file-upload-container"
        />
      </div>

      {formData.files.length > 0 && (
        <div className="uploaded-files">
          <h4>Uploaded Files:</h4>
          <ul>
            {formData.files.map((file, index) => (
              <li key={file.fileId}>
                <a href={file.viewLink} target="_blank" rel="noopener noreferrer">
                  File {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button type="submit" className="submit-btn">
        Submit Form
      </button>
    </form>
  );
}
