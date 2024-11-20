import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const UploadContainer = styled.div`
  margin-bottom: 2rem;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #4A90E2;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.isDragActive ? '#e3f2fd' : '#f8f9fa'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e3f2fd;
  }
`;

const UploadText = styled.p`
  color: #666;
  margin: 0;
  font-family: 'Poppins', sans-serif;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
`;

const ProgressContainer = styled.div`
  margin-top: 1rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #4A90E2;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const FileUpload = ({ onUploadSuccess, onUploadError }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      setError('Please select a file');
      onUploadError('Please select a file');
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      onUploadError('Please upload a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setError(null);
      setUploadProgress(0);

      console.log('Uploading file to server...');
      const response = await fetch('http://localhost:5002/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('Server response:', data);

      if (!data.previews || !Array.isArray(data.previews)) {
        throw new Error('Invalid response from server');
      }

      setUploadProgress(100);
      onUploadSuccess(data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      onUploadError(err.message);
    }
  }, [onUploadSuccess, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <UploadContainer>
      <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        <UploadText>
          {isDragActive
            ? 'Drop the PDF here...'
            : 'Drag and drop a PDF here, or click to select'}
        </UploadText>
      </DropzoneContainer>

      {uploadProgress > 0 && (
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={uploadProgress} />
          </ProgressBar>
        </ProgressContainer>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </UploadContainer>
  );
};

export default FileUpload;
