chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "incrementCounter") {
    chrome.storage.local.get({ bypassCount: 0 }, (result) => {
      const newCount = result.bypassCount + 1;
      
      // Save the new count, then use the callback to reply back to content.js
      chrome.storage.local.set({ bypassCount: newCount }, () => {
        console.log("Counter updated to: " + newCount);
        sendResponse({ success: true });
      });
    });
    
    return true; // Keeps the message channel open for async sendResponse
  }
});