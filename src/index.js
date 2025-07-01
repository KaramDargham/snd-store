import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import UserProvider from './Context/UserContext';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router future={{
    v7_relativeSplatPath: true,
    v7_startTransition: true
  }}>
    <UserProvider >
    <App />
    </UserProvider>
    </Router>
  </React.StrictMode>
);

