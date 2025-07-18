// Updated service worker for gym extension
const TAGS_STORAGE_KEY = "gym-whatsapp-tags-key";
const AUTH_STORAGE_KEY = "gym-whatsapp-auth-key";
const VALIDATION_STORAGE_KEY = "gym-whatsapp-validation-key";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    openOnInstallPage();
  }
});

chrome.runtime.setUninstallURL("https://hoxfitness.in/on-uninstall-page");

chrome.action.onClicked.addListener((tab) => {
  openExtensionIconClick();
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.name === "validateKey") {
    validateKey(msg.params)
      .then((res) => {
        response({ success: true, message: "Key validated successfully.", data: res });
      })
      .catch((err) => {
        response({ success: false, message: "Key validation failed." });
      });
  }

  if (msg.name === "clearAuth") {
    clearAuthStorage()
      .then(() => {
        response({ success: true, message: "Authentication cleared." });
      })
      .catch((err) => {
        response({ success: false, message: "Error clearing authentication." });
      });
  }

  return true;
});

function openExtensionIconClick() {
  chrome.tabs.create({ url: "https://web.whatsapp.com?mode=r-popup" });
}

function openOnInstallPage() {
  // Open landing page instead of install page
  chrome.tabs.create({ url: chrome.runtime.getURL("landing.html") });
}

async function validateKey(params) {
  const { key } = params;
  const demoKey = "DEMO-KEY-2025";
  
  return new Promise(async (resolve, reject) => {
    try {
      // Demo key validation
      if (key === demoKey) {
        await chrome.storage.local.set({
          [AUTH_STORAGE_KEY]: key,
          [VALIDATION_STORAGE_KEY]: Date.now()
        });
        resolve({ valid: true, keyType: 'demo' });
        return;
      }

      // Production key validation (placeholder endpoint)
      const url = "https://api.placeholder.com/validate-key"; // Will be replaced with working endpoint
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ key }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          await chrome.storage.local.set({
            [AUTH_STORAGE_KEY]: key,
            [VALIDATION_STORAGE_KEY]: Date.now()
          });
          resolve({ valid: true, keyType: 'production' });
        } else {
          reject(new Error('Invalid key'));
        }
      } else {
        reject(new Error('Validation service unavailable'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function clearAuthStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.remove([AUTH_STORAGE_KEY, VALIDATION_STORAGE_KEY], () => {
      resolve();
    });
  });
}

// Periodic validation check (every 30 minutes)
setInterval(async () => {
  try {
    const result = await chrome.storage.local.get([AUTH_STORAGE_KEY, VALIDATION_STORAGE_KEY]);
    if (result[AUTH_STORAGE_KEY] && result[VALIDATION_STORAGE_KEY]) {
      const now = Date.now();
      const lastValidation = result[VALIDATION_STORAGE_KEY];
      const thirtyMinutes = 30 * 60 * 1000;

      if (now - lastValidation > thirtyMinutes) {
        // Re-validate key
        await validateKey({ key: result[AUTH_STORAGE_KEY] });
      }
    }
  } catch (error) {
    console.error('Periodic validation error:', error);
  }
}, 30 * 60 * 1000); // 30 minutes