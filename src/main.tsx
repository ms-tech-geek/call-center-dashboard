import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { io } from 'socket.io-client';

// Make socket.io-client available globally
declare global {
  interface Window {
    io: typeof io;
  }
}
window.io = io;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
