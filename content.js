//simple message logger to console, because popup.js can't do it, only content scripts can
// content script is specified in manifest.json
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "echo") {
      console.log(request.messageText);
    }
  }
);