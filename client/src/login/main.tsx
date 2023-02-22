import 'modern-normalize/modern-normalize.css';
import './main.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LoginPage from './LoginPage';

createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <LoginPage />
    </StrictMode>,
  );
