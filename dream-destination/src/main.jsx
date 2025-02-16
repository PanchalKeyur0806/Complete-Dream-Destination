// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Use HashRouter instead of BrowserRouter
import StoreContextProvider from './context/StoreContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StoreContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StoreContextProvider>
);
