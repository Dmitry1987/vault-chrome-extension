/* global chrome */
// We can only access the TABs DOM with this script.
// It will get the credentials via message passing from the popup

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === 'fill_creds') {
      console.debug('Will fill credentials for \n username = ' + request.username)
      var inputs = document.getElementsByTagName('input')
      var passwordNode, usernameNode
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'password') {
          passwordNode = inputs[i]
        }
      }
      if (passwordNode === null) {
        console.error('Could not find passwordNode')
        return
      }
      var testNode = passwordNode.previousSibling
      for (; ; testNode = testNode.previousSibling) {
        if (testNode.tagName && testNode.tagName.toUpperCase() === 'input'.toUpperCase()) {
          usernameNode = testNode
          break
        }
      }

      if (usernameNode !== null) {
        usernameNode.value = request.username
        passwordNode.value = request.password
      }
    }
  }
)
