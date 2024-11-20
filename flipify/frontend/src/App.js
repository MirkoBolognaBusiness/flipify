import React, { useState } from 'react';
import styled from 'styled-components';
import FileUpload from './components/FileUpload';
import FlipBook from './components/FlipBook';
import GlobalStyles from './styles/GlobalStyles';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #4A90E2;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Poppins', sans-serif;
`;

function App() {
  const [pdfPreviews, setPdfPreviews] = useState([]);
  const [error, setError] = useState(null);

  const handleUploadSuccess = (data) => {
    console.log('Upload success:', data);
    if (data.previews && Array.isArray(data.previews)) {
      setPdfPreviews(data.previews);
      setError(null);
    } else {
      setError('Invalid response format from server');
      console.error('Invalid previews data:', data);
    }
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
    setPdfPreviews([]);
  };

  return (
    <>
      <GlobalStyles />
      <AppContainer>
        <Title>Flipify - PDF Flipbook Viewer</Title>
        <FileUpload 
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
        {error && (
          <div style={{ color: 'red', textAlign: 'center', margin: '1rem 0' }}>
            {error}
          </div>
        )}
        <FlipBook previews={pdfPreviews} />
      </AppContainer>
    </>
  );
}

export default App;
