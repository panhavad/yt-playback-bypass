// Function to show a small notification on the screen
function showNotification() {
  const notifyDiv = document.createElement('div');
  notifyDiv.textContent = "⚠️ Playback pause issue detected! refreshing...";
  
  Object.assign(notifyDiv.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#333',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: '99999',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif'
  });

  document.body.appendChild(notifyDiv);
}

// Global flag to prevent double-triggering while a refresh is pending
let isRefreshing = false;

// The 1-second loop to scan for the text itself
function checkAndRefresh() {
  if (isRefreshing) return;

  const targetText = "Playback paused because your account is being used in another location.";
  
  if (document.body && document.body.innerText.includes(targetText)) {
    isRefreshing = true; // Lock scanning
    showNotification();
    
    // Send message and WAIT for a response back before refreshing
    chrome.runtime.sendMessage({ action: "incrementCounter" }, (response) => {
      if (response && response.success) {
        // Now that we are 100% sure the counter saved, give a tiny buffer to see notification and reload
        setTimeout(() => {
          location.reload();
        }, 500);
      } else {
        // Fallback in case of an error so the page doesn't stay frozen
        location.reload();
      }
    });
  }
}

// Run the scan every 1 second
setInterval(checkAndRefresh, 1000);