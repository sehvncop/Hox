import React, { useState } from 'react';
import './App.css';

function App() {
  const [downloadStatus, setDownloadStatus] = useState('');

  const handleDownload = async () => {
    try {
      setDownloadStatus('Preparing download...');
      
      // Use the same domain with /api prefix for backend calls
      const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || '/api';
      const response = await fetch(`${backendUrl}/download-extension`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'gym-whatsapp-extension.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setDownloadStatus('Download completed!');
      setTimeout(() => setDownloadStatus(''), 3000);
    } catch (error) {
      setDownloadStatus('Download failed. Please try again.');
      setTimeout(() => setDownloadStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-8xl mb-8 animate-bounce">🏋️‍♂️</div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
            Gym WhatsApp Extension
          </h1>
          <p className="text-2xl mb-8 opacity-90">
            Send bulk messages to your gym members via CSV upload
          </p>
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="bg-white/20 backdrop-blur-lg rounded-full px-6 py-2">
              <span className="text-sm font-medium">✅ Free to Use</span>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-full px-6 py-2">
              <span className="text-sm font-medium">🔐 Secure</span>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-full px-6 py-2">
              <span className="text-sm font-medium">⚡ Fast</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-4">CSV Upload</h3>
            <p className="opacity-80">
              Upload your member list in CSV format and select the phone number column. 
              Support for custom message variables.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-4">Secure Access</h3>
            <p className="opacity-80">
              Authentication required with key validation every 30 minutes. 
              Your data stays secure and private.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-4">Smart Messaging</h3>
            <p className="opacity-80">
              Custom messages with variables, AI rewriting, random delays, 
              and attachment support.
            </p>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 mb-16 text-center">
          <h2 className="text-4xl font-bold mb-6">Download Extension</h2>
          <p className="text-lg mb-8 opacity-90">
            Get started with the Chrome extension and start sending personalized messages to your gym members
          </p>
          
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-6"
          >
            📥 Download Extension
          </button>
          
          <div className="mb-4">
            <p className="text-sm opacity-75 mb-2">Or download directly:</p>
            <a 
              href="/api/download-extension"
              download="gym-whatsapp-extension.zip"
              className="text-blue-300 hover:text-blue-100 underline text-sm"
            >
              Direct Download Link
            </a>
          </div>
          
          {downloadStatus && (
            <div className="mt-4 text-sm font-medium">
              {downloadStatus}
            </div>
          )}

          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mt-8 inline-block">
            <h3 className="text-xl font-semibold mb-3">Demo Authentication Key</h3>
            <p className="mb-3">Use this key to test the extension:</p>
            <div className="bg-black/30 rounded-lg px-4 py-2 font-mono text-lg tracking-wider">
              DEMO-KEY-2025
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">Installation Instructions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">Chrome Extension Setup</h4>
              <ol className="space-y-3 text-left">
                <li className="flex items-start">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                  <span>Download the extension file by clicking the button above</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                  <span>Open Chrome and navigate to <code className="bg-black/30 px-2 py-1 rounded">chrome://extensions/</code></span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
                  <span>Enable Developer Mode by toggling the switch in the top right</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">4</span>
                  <span>Click "Load unpacked" and select the downloaded extension folder</span>
                </li>
              </ol>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4">Using the Extension</h4>
              <ol className="space-y-3 text-left">
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                  <span>Go to WhatsApp Web and the extension will automatically appear</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                  <span>Enter the demo key: <code className="bg-black/30 px-2 py-1 rounded">DEMO-KEY-2025</code></span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
                  <span>Upload your CSV file with member phone numbers</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">4</span>
                  <span>Compose your message and start sending!</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center opacity-70">
          <p>© 2025 Gym WhatsApp Extension | Built with ❤️ for fitness professionals</p>
        </div>
      </div>
    </div>
  );
}

export default App;