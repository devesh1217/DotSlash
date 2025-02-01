"use client";
import { useState, useCallback } from 'react';

export default function FileUpload({
  onUploadSuccess,
  onUploadError,
  onUploadProgress,
  accept,
  multiple = false,
  folderId,
  className,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  };

  const handleFileChange = useCallback(async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadFile(files[i]);
        uploadedFiles.push(result);

        const progress = ((i + 1) / files.length) * 100;
        setUploadProgress(progress);
        if (onUploadProgress) {
          onUploadProgress(progress);
        }
      }

      if (onUploadSuccess) {
        onUploadSuccess(uploadedFiles);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  }, [folderId, onUploadSuccess, onUploadError, onUploadProgress]);

  return (
    <div className={className}>
      <input
        type="file"
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        disabled={isUploading}
      />
      {isUploading && (
        <div className="upload-progress">
          <div>Uploading... {Math.round(uploadProgress)}%</div>
          <div 
            className="progress-bar" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
