import React, { useState } from 'react'
import './App.css'

function App() {
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDownload = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'
    window.open(`${backendUrl}/api/download-extension`, '_blank')
  }

  const copyDemoKey = () => {
    navigator.clipboard.writeText('DEMO-KEY-2025')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 max-w-md w-full">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4 animate-bounce">🏋️‍♂️</div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-3">
              GYM EXTENSION
            </h1>
            <p className="text-white/80 text-lg font-medium">
              WhatsApp automation that hits different 💯
            </p>
          </div>

          {/* Download Button */}
          <button 
            onClick={handleDownload}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`w-full group relative overflow-hidden rounded-2xl p-4 mb-6 transition-all duration-300 transform ${
              isHovered ? 'scale-105 shadow-2xl' : 'scale-100'
            }`}
            style={{
              background: 'linear-gradient(45deg, #ff6b6b, #ff8e53, #ff6b9d, #c44569)',
              backgroundSize: '400% 400%',
              animation: 'gradient 3s ease infinite'
            }}
          >
            <div className="flex items-center justify-center space-x-3 text-white font-bold text-lg">
              <span className="text-2xl">📦</span>
              <span>Download Extension</span>
              <span className="text-xl">✨</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>

          {/* Demo Key Section */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm p-4 rounded-2xl mb-6 border border-white/10">
            <h3 className="text-white font-bold text-lg mb-2 flex items-center">
              <span className="mr-2">🔑</span>
              Demo Key (click to copy)
            </h3>
            <div 
              onClick={copyDemoKey}
              className="cursor-pointer bg-black/30 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 hover:border-pink-400/50 transition-all duration-300 transform hover:scale-105"
            >
              <code className="text-cyan-300 font-mono text-lg font-bold">
                DEMO-KEY-2025
              </code>
              {copied && (
                <span className="ml-2 text-green-400 text-sm">✓ Copied!</span>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
              <h3 className="text-white font-bold mb-3 flex items-center">
                <span className="mr-2">🔥</span>
                Features That Slap
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-green-300 flex items-center">
                  <span className="mr-2">📊</span>CSV Magic
                </div>
                <div className="text-blue-300 flex items-center">
                  <span className="mr-2">🔐</span>Secure AF
                </div>
                <div className="text-purple-300 flex items-center">
                  <span className="mr-2">⚡</span>Lightning Fast
                </div>
                <div className="text-pink-300 flex items-center">
                  <span className="mr-2">🎯</span>Zero Cap
                </div>
              </div>
            </div>
          </div>

          {/* Installation Steps */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <h3 className="text-white font-bold mb-3 flex items-center">
              <span className="mr-2">🚀</span>
              How To Install (No Cap)
            </h3>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-start">
                <span className="text-cyan-400 mr-2 font-bold">1.</span>
                <span>Download the extension above ↗️</span>
              </div>
              <div className="flex items-start">
                <span className="text-cyan-400 mr-2 font-bold">2.</span>
                <span>Extract the ZIP file 📁</span>
              </div>
              <div className="flex items-start">
                <span className="text-cyan-400 mr-2 font-bold">3.</span>
                <span>Chrome Extensions → Dev Mode ON 🔧</span>
              </div>
              <div className="flex items-start">
                <span className="text-cyan-400 mr-2 font-bold">4.</span>
                <span>Load unpacked extension 📂</span>
              </div>
              <div className="flex items-start">
                <span className="text-cyan-400 mr-2 font-bold">5.</span>
                <span>WhatsApp Web → Enter demo key 🔑</span>
              </div>
              <div className="flex items-start">
                <span className="text-cyan-400 mr-2 font-bold">6.</span>
                <span>Start flexing 💪</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-white/60 text-sm">
            <p>v1.0.0 • Built Different 🔥</p>
            <p className="mt-1">Ready to absolutely send it? 📨✨</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App