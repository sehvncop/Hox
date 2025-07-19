import React from 'react'
import './App.css'

function App() {
  const handleDownload = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'
    window.open(`${backendUrl}/api/download-extension`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🏋️‍♂️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gym WhatsApp Extension</h1>
          <p className="text-gray-600 mb-8">CSV WhatsApp Sender with Authentication</p>
          
          {/* Download Button */}
          <button 
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg mb-6 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            📦 Download Extension
          </button>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="font-semibold text-blue-900 mb-2">🔑 Demo Key</h2>
              <code className="text-blue-700 font-mono bg-blue-100 px-2 py-1 rounded">DEMO-KEY-2025</code>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="font-semibold text-green-900 mb-2">✨ Features</h2>
              <ul className="text-green-700 text-sm space-y-1 text-left">
                <li>• 📊 CSV Upload Support</li>
                <li>• 🔐 Authentication System</li>
                <li>• ⏱️ 30-minute Sessions</li>
                <li>• 📱 WhatsApp Integration</li>
                <li>• 🎯 Message Customization</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h2 className="font-semibold text-yellow-900 mb-2">🚀 Installation</h2>
              <ol className="text-yellow-700 text-sm space-y-1 text-left">
                <li>1. Download the extension above</li>
                <li>2. Extract the ZIP file</li>
                <li>3. Open Chrome Extensions</li>
                <li>4. Enable Developer Mode</li>
                <li>5. Load unpacked extension</li>
                <li>6. Visit WhatsApp Web</li>
                <li>7. Enter demo key when prompted</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-6 text-xs text-gray-500">
            Version 11.0.0 • Ready for testing
          </div>
        </div>
      </div>
    </div>
  )
}

export default App