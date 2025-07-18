// WhatsApp Gym Extension - Content Script
class WhatsAppGymExtension {
  constructor() {
    this.isAuthenticated = false;
    this.authKey = null;
    this.lastValidation = null;
    this.validationInterval = 30 * 60 * 1000; // 30 minutes
    this.demoKey = "DEMO-KEY-2025";
    this.apiEndpoint = "https://api.placeholder.com/validate-key"; // Placeholder for working endpoint
    
    this.init();
  }

  async init() {
    await this.checkStoredAuth();
    if (!this.isAuthenticated) {
      this.showAuthDialog();
    } else {
      this.setupValidationTimer();
      this.initializeExtension();
    }
  }

  async checkStoredAuth() {
    try {
      const result = await chrome.storage.local.get(['authKey', 'lastValidation']);
      if (result.authKey) {
        this.authKey = result.authKey;
        this.lastValidation = result.lastValidation;
        
        // Check if validation is still valid (within 30 minutes)
        const now = Date.now();
        if (this.lastValidation && (now - this.lastValidation < this.validationInterval)) {
          this.isAuthenticated = true;
          return;
        }
        
        // Validate key with backend
        await this.validateKeyWithBackend();
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
    }
  }

  async validateKeyWithBackend() {
    try {
      // For demo key, validate locally
      if (this.authKey === this.demoKey) {
        this.isAuthenticated = true;
        this.lastValidation = Date.now();
        await chrome.storage.local.set({
          authKey: this.authKey,
          lastValidation: this.lastValidation
        });
        return;
      }

      // For production keys, validate with backend (placeholder)
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: this.authKey })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          this.isAuthenticated = true;
          this.lastValidation = Date.now();
          await chrome.storage.local.set({
            authKey: this.authKey,
            lastValidation: this.lastValidation
          });
        } else {
          await this.clearAuth();
        }
      } else {
        // If backend is down, allow demo key to work
        if (this.authKey === this.demoKey) {
          this.isAuthenticated = true;
          this.lastValidation = Date.now();
        }
      }
    } catch (error) {
      console.error('Error validating key:', error);
      // If backend is down, allow demo key to work
      if (this.authKey === this.demoKey) {
        this.isAuthenticated = true;
        this.lastValidation = Date.now();
      }
    }
  }

  async clearAuth() {
    this.isAuthenticated = false;
    this.authKey = null;
    this.lastValidation = null;
    await chrome.storage.local.remove(['authKey', 'lastValidation']);
  }

  setupValidationTimer() {
    setInterval(async () => {
      await this.validateKeyWithBackend();
      if (!this.isAuthenticated) {
        this.showAuthDialog();
        this.hideExtension();
      }
    }, this.validationInterval);
  }

  showAuthDialog() {
    // Remove existing dialog if any
    const existingDialog = document.getElementById('gym-extension-auth-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    const authDialog = document.createElement('div');
    authDialog.id = 'gym-extension-auth-dialog';
    authDialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    authDialog.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        text-align: center;
        max-width: 400px;
        width: 90%;
        color: white;
      ">
        <div style="font-size: 48px; margin-bottom: 20px;">🏋️‍♂️</div>
        <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">WhatsApp Gym Extension</h2>
        <p style="margin: 0 0 25px 0; opacity: 0.9; font-size: 16px;">Enter your authentication key to access the extension</p>
        
        <input 
          type="password" 
          id="auth-key-input" 
          placeholder="Enter your key..."
          style="
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            box-sizing: border-box;
            margin-bottom: 20px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            backdrop-filter: blur(10px);
          "
        />
        
        <button 
          id="auth-submit-btn"
          style="
            width: 100%;
            padding: 15px;
            background: #ff6b6b;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 15px;
          "
        >
          Authenticate
        </button>
        
        <p style="margin: 0; font-size: 14px; opacity: 0.7;">
          Demo key: DEMO-KEY-2025
        </p>
      </div>
    `;

    document.body.appendChild(authDialog);

    const input = document.getElementById('auth-key-input');
    const submitBtn = document.getElementById('auth-submit-btn');

    const handleSubmit = async () => {
      const key = input.value.trim();
      if (!key) {
        input.style.borderColor = '#ff6b6b';
        return;
      }

      submitBtn.textContent = 'Validating...';
      submitBtn.disabled = true;

      this.authKey = key;
      await this.validateKeyWithBackend();

      if (this.isAuthenticated) {
        authDialog.remove();
        this.setupValidationTimer();
        this.initializeExtension();
      } else {
        submitBtn.textContent = 'Invalid Key';
        submitBtn.style.background = '#ff4757';
        setTimeout(() => {
          submitBtn.textContent = 'Authenticate';
          submitBtn.style.background = '#ff6b6b';
          submitBtn.disabled = false;
        }, 2000);
      }
    };

    submitBtn.addEventListener('click', handleSubmit);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    });

    input.focus();
  }

  hideExtension() {
    const extensionUI = document.getElementById('gym-extension-ui');
    if (extensionUI) {
      extensionUI.style.display = 'none';
    }
  }

  initializeExtension() {
    // Wait for WhatsApp to load
    const observer = new MutationObserver(() => {
      if (document.querySelector('[data-testid="chat-list"]')) {
        this.setupExtensionUI();
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupExtensionUI() {
    // Remove existing UI if any
    const existingUI = document.getElementById('gym-extension-ui');
    if (existingUI) {
      existingUI.remove();
    }

    const extensionUI = document.createElement('div');
    extensionUI.id = 'gym-extension-ui';
    extensionUI.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 380px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      border: 1px solid #e1e8ed;
      overflow: hidden;
    `;

    extensionUI.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      ">
        <div style="display: flex; align-items: center;">
          <span style="font-size: 24px; margin-right: 10px;">🏋️‍♂️</span>
          <div>
            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Gym Extension</h3>
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">CSV WhatsApp Sender</p>
          </div>
        </div>
        <button id="close-extension" style="
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.3s;
        ">✕</button>
      </div>

      <div style="padding: 20px;">
        ${this.getCSVUploadHTML()}
      </div>
    `;

    document.body.appendChild(extensionUI);

    // Setup event listeners
    document.getElementById('close-extension').addEventListener('click', () => {
      extensionUI.style.display = 'none';
    });

    this.setupCSVUploadEvents();
  }

  getCSVUploadHTML() {
    return `
      <div class="csv-upload-section">
        <div style="margin-bottom: 20px;">
          <label style="display: flex; align-items: center; margin-bottom: 10px; font-weight: 600; color: #333;">
            <span style="font-size: 20px; margin-right: 8px;">📋</span>
            Upload CSV:
          </label>
          <input 
            type="file" 
            id="csv-file-input" 
            accept=".csv"
            style="
              width: 100%;
              padding: 12px;
              border: 2px dashed #ddd;
              border-radius: 8px;
              background: #f9f9f9;
              cursor: pointer;
              transition: all 0.3s ease;
            "
          />
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
            How to send with CSV? Click here
          </p>
        </div>

        <div id="csv-options" style="display: none;">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
              <span style="font-size: 16px; margin-right: 5px;">📞</span>
              Select column with phone numbers:
            </label>
            <select id="phone-column-select" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 6px;
              font-size: 14px;
            ">
              <option value="">Select column</option>
            </select>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: flex; align-items: center; font-size: 14px; color: #333;">
              <input type="checkbox" id="use-headers" checked style="margin-right: 8px;">
              Use first row for headers: 
              <span style="margin-left: 5px; color: #666;">📋</span>
            </label>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
              <span style="font-size: 16px; margin-right: 5px;">💬</span>
              Message:
            </label>
            <select id="message-type" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 6px;
              font-size: 14px;
              margin-bottom: 10px;
            ">
              <option value="custom">Custom Message</option>
              <option value="variable">Insert Variable</option>
            </select>
            <textarea id="message-text" placeholder="Enter message..." style="
              width: 100%;
              min-height: 80px;
              padding: 12px;
              border: 1px solid #ddd;
              border-radius: 6px;
              font-size: 14px;
              resize: vertical;
              box-sizing: border-box;
            "></textarea>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: flex; align-items: center; font-size: 14px; color: #333;">
              <span style="font-size: 16px; margin-right: 5px;">🤖</span>
              Rewrite message with AI:
              <div style="
                position: relative;
                display: inline-block;
                margin-left: 10px;
              ">
                <input type="checkbox" id="ai-rewrite" style="display: none;">
                <label for="ai-rewrite" style="
                  display: inline-block;
                  width: 50px;
                  height: 26px;
                  background: #ccc;
                  border-radius: 13px;
                  position: relative;
                  cursor: pointer;
                  transition: background 0.3s;
                ">
                  <span style="
                    display: block;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    transition: transform 0.3s;
                  "></span>
                </label>
              </div>
            </label>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: flex; align-items: center; font-size: 14px; color: #333;">
              <input type="checkbox" id="send-attachment" style="margin-right: 8px;">
              Send attachment 
              <span style="margin-left: 5px; color: #666;">📎</span>
            </label>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
              Add a random time delay of 
              <input type="number" id="delay-min" value="3" min="1" style="
                width: 50px;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
                text-align: center;
                margin: 0 5px;
              "> and 
              <input type="number" id="delay-max" value="6" min="1" style="
                width: 50px;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
                text-align: center;
                margin: 0 5px;
              "> seconds between messages.
            </label>
          </div>

          <div style="text-align: center;">
            <button id="send-whatsapp" style="
              background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
              color: white;
              border: none;
              padding: 15px 30px;
              border-radius: 25px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
            ">
              <span style="margin-right: 8px;">📱</span>
              Send WhatsApp
            </button>
          </div>

          <div style="margin-top: 15px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              <span id="message-count">0</span> of 200 sent - 
              <a href="#" style="color: #667eea; text-decoration: none;">Click here to upgrade</a>
            </p>
          </div>
        </div>
      </div>
    `;
  }

  setupCSVUploadEvents() {
    const fileInput = document.getElementById('csv-file-input');
    const csvOptions = document.getElementById('csv-options');
    const phoneColumnSelect = document.getElementById('phone-column-select');
    const sendButton = document.getElementById('send-whatsapp');
    const aiRewriteCheckbox = document.getElementById('ai-rewrite');

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'text/csv') {
        this.parseCSV(file);
        csvOptions.style.display = 'block';
      }
    });

    // AI rewrite toggle styling
    aiRewriteCheckbox.addEventListener('change', (e) => {
      const label = e.target.nextElementSibling;
      const span = label.querySelector('span');
      if (e.target.checked) {
        label.style.background = '#667eea';
        span.style.transform = 'translateX(24px)';
      } else {
        label.style.background = '#ccc';
        span.style.transform = 'translateX(0)';
      }
    });

    sendButton.addEventListener('click', () => {
      this.sendWhatsAppMessages();
    });
  }

  parseCSV(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      const phoneColumnSelect = document.getElementById('phone-column-select');
      phoneColumnSelect.innerHTML = '<option value="">Select column</option>';
      
      headers.forEach((header, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = header.trim();
        phoneColumnSelect.appendChild(option);
      });

      this.csvData = lines.slice(1).map(line => line.split(','));
      this.csvHeaders = headers;
    };
    reader.readAsText(file);
  }

  async sendWhatsAppMessages() {
    const phoneColumnIndex = document.getElementById('phone-column-select').value;
    const messageText = document.getElementById('message-text').value;
    const delayMin = parseInt(document.getElementById('delay-min').value);
    const delayMax = parseInt(document.getElementById('delay-max').value);

    if (!phoneColumnIndex || !messageText || !this.csvData) {
      alert('Please select a phone column and enter a message');
      return;
    }

    const sendButton = document.getElementById('send-whatsapp');
    sendButton.textContent = 'Sending...';
    sendButton.disabled = true;

    let sentCount = 0;
    const messageCountElement = document.getElementById('message-count');

    for (const row of this.csvData) {
      if (sentCount >= 200) break; // Limit to 200 messages

      const phoneNumber = row[phoneColumnIndex];
      if (!phoneNumber) continue;

      try {
        await this.sendSingleMessage(phoneNumber, messageText);
        sentCount++;
        messageCountElement.textContent = sentCount;

        // Random delay between messages
        const delay = Math.random() * (delayMax - delayMin) + delayMin;
        await this.sleep(delay * 1000);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }

    sendButton.textContent = 'Send WhatsApp';
    sendButton.disabled = false;
    alert(`Sent ${sentCount} messages successfully!`);
  }

  async sendSingleMessage(phoneNumber, message) {
    // Clean phone number
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Open WhatsApp chat
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`;
    
    // Create a new tab or use existing WhatsApp tab
    const tabs = await chrome.tabs.query({url: "*://web.whatsapp.com/*"});
    if (tabs.length > 0) {
      await chrome.tabs.update(tabs[0].id, {url: whatsappUrl});
    } else {
      await chrome.tabs.create({url: whatsappUrl});
    }

    // Wait for page to load and send message
    await this.sleep(3000);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize the extension when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WhatsAppGymExtension();
  });
} else {
  new WhatsAppGymExtension();
}