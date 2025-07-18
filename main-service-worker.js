try {
  
  const TAGS_STORAGE_KEY = "hoxfitness-whatsapp-tags-key";
  const ACCESSORIES_STORAGE_KEY = "hoxfitness-whatsapp-accessories-data";
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      openOnInstallPage();
    }

    setDefaultAccessoryValues();
    initializeFrequentMessagesToStorage();

    // if (details.reason == 'update') {
    //   chrome.tabs.create({
    //     url: "https://hoxfitness.in/on-update-page",
    //     active: true,
    //   });
    // }

  });

  chrome.runtime.setUninstallURL("https://hoxfitness.in/on-uninstall-page");


  chrome.action.onClicked.addListener((tab) => {
    openExtensionIconClick();
  });

  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.name === "validateLicense") {
      validateLicense(msg.params)
        .then((res) => {
          response({ success: true, message: "License key activated.", data: res });
        })
        .catch((err) => {
          response({ sucess: false, message: "An error occurred. Please contact customer service." });
        });
    }

    return true;
  });

  function openExtensionIconClick() {
    chrome.tabs.create({ url: "https://web.whatsapp.com?mode=r-popup" });
  }

  function openOnInstallPage() {
    chrome.tabs.create({ url: "https://hoxfitness.in/on-install-page" });
  }

  let initializeFrequentMessagesToStorage = () => {
    const getQuickChatStoredData = (callback) => {
      chrome.storage.local.get([TAGS_STORAGE_KEY], function (result) {
        callback(result);
      });
    };

    let content = [];
    getQuickChatStoredData((result) => {
      if (Array.isArray(result[TAGS_STORAGE_KEY])) {
        content = result[TAGS_STORAGE_KEY];
      }
      if (content.length === 0) {
        content.push("Hi, how can I help?");
        content.push("Can I get back to you soon?");
        content.push("You are welcome.");
      }

      chrome.storage.local.set(
        { [TAGS_STORAGE_KEY]: content },
        function () { }
      );
    });
  };

  let validateLicense = (params) => {
    return new Promise((resolve, reject) => {
      const url = "https://api.hoxfitness.in/validate-license";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(params),
      })
        .then((res) => res.json())
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const setDefaultAccessoryValues = () => {

    chrome.storage.local.get([ACCESSORIES_STORAGE_KEY], function (result) {
      if (!result[ACCESSORIES_STORAGE_KEY]) {
        chrome.storage.local.set(
          { [ACCESSORIES_STORAGE_KEY]: { "highlight-unread": true } },
          function () { }
        );
      }

    });


  }
} catch (e) { }
