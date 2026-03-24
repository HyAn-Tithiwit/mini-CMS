// File: src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Xóa dòng import './index.css' cũ của Vite đi (nếu có)
// Thêm dòng này vào để import file index.css mới của bạn:
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)