// Function to update the DOM safely
function updatePopupDisplay() {
  chrome.storage.local.get({ bypassCount: 0 }, (result) => {
    const countTarget = document.getElementById('count');
    if (countTarget) {
      countTarget.innerText = String(result.bypassCount);
    } else {
      setTimeout(updatePopupDisplay, 50);
    }
  });
}

// 1. Initial trigger setups
updatePopupDisplay();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updatePopupDisplay);
} else {
  updatePopupDisplay();
}

// 2. Sync Button
const syncBtn = document.getElementById('refreshBtn');
if (syncBtn) {
  syncBtn.addEventListener('click', updatePopupDisplay);
}

// 3. Reset Button Logic
const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset the bypass counter to 0?")) {
      // Wipe the storage back to 0
      chrome.storage.local.set({ bypassCount: 0 }, () => {
        console.log("Counter reset to 0");
        updatePopupDisplay(); // Refresh the UI text instantly
      });
    }
  });
}

// 4. Live Sync Listener
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.bypassCount) {
    const countTarget = document.getElementById('count');
    if (countTarget) {
      countTarget.innerText = String(changes.bypassCount.newValue ?? 0);
    }
  }
});