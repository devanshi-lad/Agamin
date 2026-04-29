import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CryptoContext from "./CryptoContext";
import { AuthProvider } from './AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CryptoContext>
        <App />
      </CryptoContext>
    </AuthProvider>
  </StrictMode>,
)
