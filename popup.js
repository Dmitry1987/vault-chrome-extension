/* global chrome jQuery */
/* eslint "space-before-function-paren": ["error", {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
    }], */

var vaultServerAdress, vaultToken, secretList, currentUrl

function mainLoaded() {
  var resultList = document.getElementById('resultList')

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    for (let tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
      var tab = tabs[tabIndex]
      if (tab.url) {
        currentUrl = tab.url
      }
    }
  })

  chrome.storage.local.get(['vaultToken'], function (result) {
    if (result.vaultToken) {
      vaultToken = result.vaultToken
    } else {
      console.error('No Vault-Token information available\nPlease use the options page to login')
    }
  })
  chrome.storage.sync.get(['vaultAddress'], function (result) {
    vaultServerAdress = result.vaultAddress
  })

  chrome.storage.sync.get(['secrets'], function (result) {
    secretList = result.secrets
    if (!secretList) {
      secretList = []
    }
    resultList.textContent = ''

    secretList.forEach(secret => {
      jQuery.ajax({
        type: 'LIST',
        url: vaultServerAdress + '/v1/secret/metadata/vaultPass/' + secret,
        headers: { 'X-Vault-Token': vaultToken },
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
          data.data.keys.forEach(element => {
            var pattern = new RegExp(element)
            var patternMatches = pattern.test(currentUrl)
            console.log(element + ' - ' + currentUrl + ' - ' + patternMatches)
            if (patternMatches) {
              getCredentials(vaultServerAdress + '/v1/secret/data/vaultPass/' + secret + element).then((credentials) =>
                addCredentials(credentials.data.data, element, resultList))
            }
          })
        },
        error: function (data) {
          console.error('ERROR accessing ' + secret + ': ' + JSON.stringify(data))
        }
      })
    })
  })
}

function addCredentials(credentials, credentialName, list) {
  var item = document.createElement('li')
  console.log(credentials)
  item.addEventListener('click', function () {
    fillCredentialsInBrowser(credentials.username, credentials.password)
  })
  item.appendChild(document.createTextNode(credentialName + ' - ' + JSON.stringify(credentials)))
  list.appendChild(item)
}

async function getCredentials(urlPath) {
  console.debug('Looking for credentials in ' + urlPath)
  let result

  try {
    result = await jQuery.ajax({
      type: 'GET',
      url: urlPath,
      headers: { 'X-Vault-Token': vaultToken },
      contentType: 'application/json',
      dataType: 'json'
    })

    return result
  } catch (error) {
    console.error(error)
  }
}

function fillCredentialsInBrowser(username, password) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    for (let tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
      var tab = tabs[tabIndex]
      if (tab.url) {
        console.log(tab)
        currentUrl = tab.url

        chrome.tabs.sendMessage(tab.id, { message: 'fill_creds', username: username, password: password }, function () { })
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', mainLoaded, false)
