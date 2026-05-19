import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { predictService } from '../services/api';

export const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { getToken } = useAuth();

  const handleFileSelect = (file) => {
    setError('');
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG, and WEBP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Max size is 5MB.');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitPrediction = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await predictService.predict(selectedFile);
      setResult(data.result);
    } catch (err) {
      setError(err.message || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="upload-page">
    <div className="upload-inner">

      <h1 className="upload-title">Upload Image</h1>
      <p className="upload-subtitle">
        Upload a clear image of the skin area you want to diagnose
      </p>

      {error && <div className="alert alert-error show">{error}</div>}

      {!preview ? (
        <div
          className={`drop-zone ${dragOver ? 'dragover' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="drop-zone-icon">
            <span className="material-icons">cloud_upload</span>
          </div>
          <div className="drop-zone-text">
            Drag and drop your image here or click to select
          </div>
          <div className="drop-zone-hint">
            Supported formats: JPG, PNG, WEBP (Max 5MB)
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div>
          <div className="preview-wrapper">
            <img src={preview} alt="Preview" />
          </div>

          {!result ? (
            <div className="upload-actions">
              <button
                className="btn btn-primary"
                onClick={submitPrediction}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner"></span> Analyzing...</>
                ) : (
                  <><span className="material-icons" style={{ fontSize: '18px' }}>biotech</span> Analyze Image</>
                )}
              </button>
              <button className="btn btn-ghost" onClick={removeImage} disabled={loading}>
                <span className="material-icons" style={{ fontSize: '18px' }}>delete</span>
                Remove
              </button>
            </div>
          ) : (
            <div className="result-card">
              <div className="result-icon">
                <span className="material-icons">check_circle</span>
              </div>

              <p className="result-label">Predicted Diagnosis</p>
              <h2 className="result-disease">{result.disease}</h2>

              <div className="result-confidence-row">
                <span>Confidence Score</span>
                <span>{result.confidence}%</span>
              </div>
              <div className="confidence-bar-track">
                <div
                  className="confidence-bar-fill"
                  style={{ width: `${parseFloat(result.confidence)}%` }}
                />
              </div>

              <button className="btn btn-primary" onClick={removeImage} style={{ width: '100%' }}>
                <span className="material-icons" style={{ fontSize: '18px' }}>refresh</span>
                Analyze Another Image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
};
