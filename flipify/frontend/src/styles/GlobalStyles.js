import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #4A90E2;
    --secondary-color: #7E57C2;
    --text-color: #333333;
    --gradient-primary: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f5f5f5;
    overflow-x: hidden;
    color: var(--text-color);
    line-height: 1.6;
  }

  button {
    font-family: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1.2;
  }

  .flip-book {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    display: none;
    background: #fff;
    border-radius: 4px;
    
    &.--active {
      display: block;
    }
  }

  .--page-flip {
    position: relative;
    perspective: 3000px;
    transform-style: preserve-3d;
  }

  @keyframes pageIn {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(-180deg);
    }
  }

  @keyframes pageOut {
    0% {
      transform: rotateY(180deg);
    }
    100% {
      transform: rotateY(0deg);
    }
  }

  .--left {
    animation: pageIn 0.6s ease-in-out;
  }

  .--right {
    animation: pageOut 0.6s ease-in-out;
  }

  /* turn.js specific styles */
  .turn-page {
    background-color: white;
    background-size: 100% 100%;
  }

  .turn-page-wrapper {
    perspective: 2000px;
  }

  .turn-page-wrapper > div {
    transform-style: preserve-3d;
  }

  .turn-page-wrapper.hard {
    background: #3c3c3c !important;
    border: solid 1px #1a1a1a;
  }

  .turn-page-wrapper.hard.even:before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%);
    content: '';
    pointer-events: none;
  }

  .turn-page-wrapper.hard.odd:before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to left, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%);
    content: '';
    pointer-events: none;
  }

  /* Fullscreen mode styles */
  :fullscreen {
    background: #f5f5f5;
  }

  :-webkit-full-screen {
    background: #f5f5f5;
  }

  :-moz-full-screen {
    background: #f5f5f5;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #4A90E2;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #357ABD;
  }

  /* Transitions */
  button, input {
    transition: all 0.3s ease;
  }

  /* Disable text selection during page turn */
  .turn-page-wrapper {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Loading animation */
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      opacity: 0.5;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(0.95);
      opacity: 0.5;
    }
  }

  .loading {
    animation: pulse 1.5s ease-in-out infinite;
  }
`;

export default GlobalStyles;
