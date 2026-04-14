import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { AppProvider } from './context/AppContext'  // 👈 ADD THIS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>   {/* 👈 VERY IMPORTANT */}
      <App />
    </AppProvider>
  </React.StrictMode>
)
