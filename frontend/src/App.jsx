import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🏋️‍♂️ Gym Extension</h1>
          <p className="text-gray-600 mb-6">WhatsApp Extension Landing Page</p>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="font-semibold text-blue-900">Demo Key</h2>
              <code className="text-blue-700 font-mono">DEMO-KEY-2025</code>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="font-semibold text-green-900">Features</h2>
              <ul className="text-green-700 text-sm space-y-1 mt-2">
                <li>• CSV Upload Support</li>
                <li>• Authentication System</li>
                <li>• 30-minute Sessions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App