/* global authButtonClick chrome jQuery */
/* export vaultToken */
/* eslint "space-before-function-paren": ["error", {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
    }], */

var vaultServerAdress, vaultToken

function mainLoaded() {
  // get inputs from form elements, server URL, login and password
  var vaultServer = document.getElementById('serverBox')
  var login = document.getElementById('loginBox')

  chrome.storage.sync.get(['vaultAddress'], function (result) {
    if (result.vaultAddress) {
      vaultServer.value = result.vaultAddress
      vaultServerAdress = result.vaultAddress
    }
  })
  chrome.storage.sync.get(['username'], function (result) {
    if (result.username) {
      login.value = result.username
    }
  })
  chrome.storage.local.get(['vaultToken'], function (result) {
    if (result.vaultToken) {
      vaultToken = result.vaultToken
      querySecrets(vaultServerAdress)
    }
  })
  // put listener on login button
  document.getElementById('authButton').addEventListener('click', authButtonClick, false)
  document.getElementById('logoutButton').addEventListener('click', logout, false)
}

function querySecrets(vaultServerAdress) {
  // Hide login prompt if we already have a Token
  document.getElementById('login').style.visibility = 'hidden'
  document.getElementById('logout').style.visibility = 'visible'
  var notify = document.getElementById('notify')

  jQuery.ajax({
    type: 'LIST',
    url: vaultServerAdress + '/v1/secret/metadata/vaultPass',
    headers: { 'X-Vault-Token': vaultToken },
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      // notify.textContent = 'Available keys ' + JSON.stringify(data.data.keys)
      displaySecrets(data.data.keys)
    },
    error: function (data) {
      notify.textContent = 'ERROR: ' + JSON.stringify(data)
    }
  })
}

function logout() {
  document.getElementById('login').style.visibility = 'visible'
  document.getElementById('logout').style.visibility = 'hidden'
  document.getElementById('secretList').innerHTML = ''
  document.getElementById('notify').innerHTML = ''

  chrome.storage.local.set({ 'vaultToken': null }, function () { })
}

function displaySecrets(secrets) {
  var secretList = document.getElementById('secretList')
  var activeSecrets = []
  secretList.appendChild(document.createTextNode('Available secret folders'))
  var list = document.createElement('ul')
  chrome.storage.sync.get(['secrets'], function (result) {
    activeSecrets = result.secrets
    if (!activeSecrets) {
      activeSecrets = []
    }

    secrets.forEach(secret => {
      // Create the list item:
      var item = document.createElement('li')

      var checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.value = 1
      checkbox.name = secret
      checkbox.checked = activeSecrets.indexOf(secret) > -1
      checkbox.addEventListener('change', secretChanged)

      item.appendChild(checkbox)
      // Set its contents:
      item.appendChild(document.createTextNode('  ' + secret))

      // Add it to the list:
      list.appendChild(item)
    })
  })

  secretList.appendChild(list)
}

function secretChanged() {
  var checkbox = this
  if (this.checked) {
    jQuery.ajax({
      type: 'LIST',
      url: vaultServerAdress + '/v1/secret/metadata/vaultPass/' + checkbox.name,
      headers: { 'X-Vault-Token': vaultToken },
      contentType: 'application/json',
      dataType: 'json',
      success: function (data) {
        chrome.storage.sync.get(['secrets'], function (result) {
          var secretList = result.secrets
          if (!secretList) {
            secretList = []
          }
          if (secretList.indexOf(checkbox.name > -1)) {
            secretList.push(checkbox.name)
          }
          chrome.storage.sync.set({ 'secrets': secretList }, function () { })
        })
      },
      error: function (data) {
        console.error('ERROR accessing this field: ' + JSON.stringify(data))
        checkbox.checked = false
        checkbox.disabled = true
        checkbox.parentElement.style = 'text-decoration:line-through; color: red;'
      }
    })
  } else {
    chrome.storage.sync.get(['secrets'], function (result) {
      var secretList = result.secrets
      if (!secretList) {
        secretList = []
      }

      for (let index = secretList.indexOf(checkbox.name); index > -1; index = secretList.indexOf(checkbox.name)) {
        secretList.splice(index, 1)
      }
      chrome.storage.sync.set({ 'secrets': secretList }, function () { })
    })
  }
}

document.addEventListener('DOMContentLoaded', mainLoaded, false)
