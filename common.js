/* global jQuery chrome notify vaultToken querySecrets */
/* eslint no-unused-vars: "off" */
/* eslint "space-before-function-paren": ["error", {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
    }], */

// invoked after user clicks "login to vault" button, if all fields filled in, and URL passed regexp check.
function authToVault(vaultServer, username, password, authMount) {
  var notify = document.getElementById('notify')
  console.debug('Login attempt: ' + vaultServer + '/v1/auth/' + authMount + '/login/' + username)
  jQuery.ajax({
    type: 'POST',
    url: vaultServer + '/v1/auth/' + authMount + '/login/' + username,
    data: JSON.stringify({ 'password': password }),
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      notify.textContent = 'AUTH SUCCESS, token: ' + data.auth.client_token
      vaultToken = data.auth.client_token
      chrome.storage.local.set({ 'vaultToken': data.auth.client_token }, function () { })
      querySecrets(vaultServer)
      // TODO: Use user token to generate app token with 20h validity - then use THAT token
    },
    error: function (data) {
      notify.textContent = 'ERROR: ' + JSON.stringify(data)
    }
  })
}

// verify URL function (copy pasted from google, standard one)
function checkURL(value) {
  var urlregex = new RegExp("^(http|https)://([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&amp;%$-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]).(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0).(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0).(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9-]+.)*[a-zA-Z0-9-]+.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(/($|[a-zA-Z0-9.,?'\\+&amp;%$#=~_-]+))*$")
  if (urlregex.test(value)) {
    return (true)
  }
  return (false)
}

function authButtonClick() {
  var notify = document.getElementById('notify')
  console.debug('AUTH initiated!')
  // get inputs from form elements, server URL, login and password
  var vaultServer = document.getElementById('serverBox')
  var login = document.getElementById('loginBox')
  var authMount = document.getElementById('authMount')
  var pass = document.getElementById('passBox')
  // verify input not empty. TODO: verify correct URL format.
  if ((vaultServer.value.length > 0) && (login.value.length > 0) && (pass.value.length > 0)) {
    // another simple step is to verify URL
    if (checkURL(vaultServer.value)) {
      // if input exist and URL is ok, attempt authorization to specified vault server URL.
      chrome.storage.sync.set({ 'vaultAddress': vaultServer.value }, function () { })
      chrome.storage.sync.set({ 'username': login.value }, function () { })
      authToVault(vaultServer.value, login.value, pass.value, authMount.value)
    } else {
      notify.textContent = 'Bad URL format, please verify'
    }
  } else {
    notify.textContent = 'Bad input, must fill in all 3 fields.'
  }
}
