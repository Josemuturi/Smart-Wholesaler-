// main.jsx — BIT3208 Week 1
// React DOM mount point. Renders the root <App /> component into #root.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
