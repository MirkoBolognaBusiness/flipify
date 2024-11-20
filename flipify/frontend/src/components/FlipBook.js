import React, { useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styled from 'styled-components';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const FlipBookContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  min-height: 100vh;
  background: #f5f5f5;
`;

const BookWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  height: calc(100vh - 200px);
  min-height: 700px;
  position: relative;
  perspective: 1500px;
  transform-style: preserve-3d;
`;

const Page = styled.div`
  background-color: white;
  position: relative;
  width: 100%;
  height: 100%;
  box-shadow: inset -7px 0 30px -7px rgba(0, 0, 0, 0.4);
  border-radius: ${props => props.position === 'left' ? '3px 0 0 3px' : '0 3px 3px 0'};
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to ${props => props.position === 'left' ? 'right' : 'left'},
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.0) 20%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &.--left {
    box-shadow: inset 7px 0 30px -7px rgba(0, 0, 0, 0.4);
  }

  &:hover:before {
    opacity: 1;
  }
`;

const PageImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

const Controls = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  align-items: center;
  background: white;
  padding: 15px 30px;
  border-radius: 50px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Button = styled.button`
  background: ${props => props.primary ? '#4A90E2' : 'white'};
  color: ${props => props.primary ? 'white' : '#4A90E2'};
  border: 2px solid #4A90E2;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(74, 144, 226, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PageNumber = styled.div`
  font-family: 'Poppins', sans-serif;
  color: #666;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PageInput = styled.input`
  width: 60px;
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 25px;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4A90E2;
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
`;

const ZoomControls = styled.div`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
  padding: 10px;
  border-radius: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const FlipBook = ({ previews = [] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [inputPage, setInputPage] = useState('1');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const bookRef = useRef();

  const totalPages = previews.length;
  const displayedPages = Math.ceil(totalPages / 2);

  const handlePageFlip = (e) => {
    const pageNum = e.data * 2;
    setCurrentPage(pageNum);
    setInputPage(String(pageNum + 1));
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 0 && pageNum < displayedPages && bookRef.current) {
      bookRef.current.pageFlip().flip(pageNum);
    }
  };

  const handlePrevPage = () => {
    goToPage(Math.max(0, currentPage / 2 - 1));
  };

  const handleNextPage = () => {
    goToPage(Math.min(displayedPages - 1, currentPage / 2 + 1));
  };

  const handlePageInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setInputPage(value);
    }
  };

  const handlePageInputSubmit = (e) => {
    if (e.key === 'Enter') {
      const pageNum = parseInt(inputPage, 10) - 1;
      if (pageNum >= 0 && pageNum < totalPages) {
        goToPage(Math.floor(pageNum / 2));
      } else {
        setInputPage(String(currentPage + 1));
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoom = (delta) => {
    const newZoom = Math.min(Math.max(zoom + delta, 50), 200);
    setZoom(newZoom);
    if (bookRef.current) {
      bookRef.current.pageFlip().getElement().style.transform = `scale(${newZoom / 100})`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      handleNextPage();
    } else if (e.key === 'ArrowLeft') {
      handlePrevPage();
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  if (!previews.length) {
    return (
      <FlipBookContainer>
        <BookWrapper>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            fontFamily: 'Poppins, sans-serif',
            textAlign: 'center'
          }}>
            Upload a PDF to start reading
          </div>
        </BookWrapper>
      </FlipBookContainer>
    );
  }

  return (
    <FlipBookContainer>
      <BookWrapper>
        <HTMLFlipBook
          width={700}
          height={800}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={handlePageFlip}
          className="demo-book"
          ref={bookRef}
          useMouseEvents={true}
          flippingTime={1000}
          usePortrait={false}
          startPage={0}
          drawShadow={true}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {previews.map((preview, index) => (
            <Page key={index} position={index % 2 === 0 ? 'left' : 'right'}>
              <PageImg
                src={`${API_URL}${preview}`}
                alt={`Page ${index + 1}`}
                loading="lazy"
              />
            </Page>
          ))}
        </HTMLFlipBook>
      </BookWrapper>

      <Controls>
        <Button onClick={handlePrevPage} disabled={currentPage === 0}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
          Previous
        </Button>

        <PageNumber>
          Page
          <PageInput
            type="text"
            value={inputPage}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputSubmit}
          />
          of {totalPages}
        </PageNumber>

        <Button onClick={handleNextPage} disabled={currentPage >= totalPages - 2}>
          Next
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </Button>

        <Button onClick={toggleFullscreen} primary>
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          )}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </Controls>

      <ZoomControls>
        <Button onClick={() => handleZoom(10)}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </Button>
        <div style={{ textAlign: 'center', color: '#666' }}>{zoom}%</div>
        <Button onClick={() => handleZoom(-10)}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H5v-2h14v2z"/>
          </svg>
        </Button>
      </ZoomControls>
    </FlipBookContainer>
  );
};

export default FlipBook;
