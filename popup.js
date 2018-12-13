//global vars

var vaultServer = "";
var login = "";
var pass = "";
var userToken = "";

//sleep function for debugging purposes (read text values)
function sleep(miliseconds) {
	var currentTime = new Date().getTime();
	while (currentTime + miliseconds >= new Date().getTime()) {

	}
}

//verify URL function (copy pasted from google, standart one)
function checkURL(value) {
	var urlregex = new RegExp("^(http|https)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
	if (urlregex.test(value)) {
		return (true);
	}
	return (false);
}

// clear page after auth
function clearPage() {
	elementsToClear = ["serverBox", "loginBox", "passBox", "authButton", "serverBoxLabel", "loginBoxLabel", "passBoxLabel", "authHeader"]
	var dels = {}
	for (var i in elementsToClear) {
		dels[i] = document.getElementById(elementsToClear[i]);
		dels[i].parentNode.removeChild(dels[i]);
	}
}


// read secret

function writeSecret() {
	// send GET request to show mounts available
	notify.textContent = "writing to: " + vaultServer.value + "/v1/" + inputTextWrite.value
	jQuery.ajax({
		type: "POST",
		method: "POST",
		data: '{"' + inputTextWriteKey.value + '":"' + inputTextWriteValue.value + '"}',
		url: vaultServer.value + "/v1/" + inputTextWrite.value,
		headers: {
			'X-Vault-Token': userToken,
			'Content-Type': 'application/json'
		},
		contents: "json",
		dataType: "json",
		success: function () {
			notify.textContent = "Secret value written!"
		}
	})
}

function readSecret() {
	// send GET request to show mounts available
	notify.textContent = "fetching from: " + vaultServer.value + "/v1/" + inputTextRead.value

	jQuery.ajax({
		type: "GET",
		method: "GET",
		url: vaultServer.value + "/v1/" + inputTextRead.value,
		headers: {
			'X-Vault-Token': userToken
		},
		contents: "json",
		dataType: "json",
		success: function (data) {
			notify.textContent = "Secret value:" + JSON.stringify(data.data)
		}
	})
}


// show mounts after login
function showMounts(params) {
	// send GET request to show mounts available
	jQuery.ajax({
		type: "GET",
		url: params.url + params.urlSuffix,
		headers: {
			'X-Vault-Token': params.token
		},
		contents: "json",
		dataType: "json",
		success: function (data) {

			notify.innerText = "Mount List SUCCESS.\nAvailable mounts: "

			var mountNames = Object.keys(data)
			mounts.innerText = ""
			for (var num in mountNames) {
				mounts.innerText += mountNames[num] + "\n"
			}
			// fields for secret read , and button

			var label1 = document.createElement('label');
			label1.innerHTML = "Read secret: ";
			document.body.appendChild(label1);


			inputTextRead = document.createElement("input");
			inputTextRead.type = "text";
			inputTextRead.id = "inputTextRead";
			inputTextRead.value = "read secret path";
			document.body.appendChild(inputTextRead);

			var getSecretBtn = document.createElement("BUTTON");
			getSecretBtn.type = "submit"
			getSecretBtn.setAttribute('class', 'btn btn-success')
			var txtReadSecret = document.createTextNode("Read secret");
			getSecretBtn.appendChild(txtReadSecret);
			document.body.appendChild(getSecretBtn);

			document.body.appendChild(document.createElement("br"));
			document.body.appendChild(document.createElement("br"));
			document.body.appendChild(document.createElement("br"));

			var label2 = document.createElement('label');
			label2.innerHTML = "Write secret to: ";
			document.body.appendChild(label2);

			// fields for write key / value / secret , and button
			inputTextWrite = document.createElement("input");
			inputTextWrite.type = "text";
			inputTextWrite.id = "inputTextWrite";
			inputTextWrite.value = "path to secret";
			document.body.appendChild(inputTextWrite);

			document.body.appendChild(document.createElement("br"));

			var label3 = document.createElement('label');
			label3.innerHTML = "Key: ";
			document.body.appendChild(label3);

			inputTextWriteKey = document.createElement("input");
			inputTextWriteKey.type = "text";
			inputTextWriteKey.id = "inputTextWriteKey";
			inputTextWriteKey.value = "key";
			document.body.appendChild(inputTextWriteKey);
			document.body.appendChild(document.createElement("br"));

			var label4 = document.createElement('label');
			label4.innerHTML = "Value: ";
			document.body.appendChild(label4);

			inputTextWriteValue = document.createElement("input");
			inputTextWriteValue.type = "text";
			inputTextWriteValue.id = "inputTextWriteValue";
			inputTextWriteValue.value = "value";
			document.body.appendChild(inputTextWriteValue);

			document.body.appendChild(document.createElement("br"));
			document.body.appendChild(document.createElement("br"));

			var setSecretBtn = document.createElement("BUTTON");
			setSecretBtn.type = "submit"
			setSecretBtn.setAttribute('class', 'btn btn-danger')
			var txtWriteSecret = document.createTextNode("Write secret!");
			setSecretBtn.appendChild(txtWriteSecret);
			document.body.appendChild(setSecretBtn);
			document.body.appendChild(document.createElement("br"));
			document.body.appendChild(document.createElement("br"));

			getSecretBtn.addEventListener('click', readSecret, false);
			setSecretBtn.addEventListener('click', writeSecret, false);
		},
		error: function (data) {
			notify.textContent = "ERROR: " + JSON.stringify(data) + " Token: " + params.token
		}
	});
}

// invoked after user clicks "login to vault" button, if all fields filled in, and URL passed regexp check.
function authToVault(myurl, username, password) {

	notify.textContent = "server: " + myurl + "/v1/auth/ldap/login/" + username;
	sleep(500)

	jQuery.ajax({
		type: "POST",
		url: myurl + "/v1/auth/ldap/login/" + username,
		data: JSON.stringify({ password: password }),
		contents: "json",
		dataType: "json",
		success: function (data) {
			notify.textContent = "AUTH SUCCESS, token: " + data.auth.client_token;
			mounts.textContent = "mounts list here"
			sleep(500)
			// set global token for other functions
			userToken = data.auth.client_token

			//clear page from auth items
			clearPage()

			// pass those params to showMounts function
			var params = {
				token: data.auth.client_token,
				url: myurl,
				urlSuffix: "/v1/sys/mounts"
			}
			//show all mounts
			showMounts(params)
		},
		error: function (data) {
			notify.textContent = "ERROR: " + JSON.stringify(data);
		}
	});

}



function authButtonClick() {
	//get inputs from form elements, server URL, login and password
	vaultServer = document.getElementById('serverBox');
	login = document.getElementById('loginBox');
	pass = document.getElementById('passBox');
	//verify input not empty. TODO: verify correct URL format.
	if ((vaultServer.value.length > 0) && (login.value.length > 0) && (pass.value.length > 0)) {
		//another simple step is to verify URL
		if (checkURL(vaultServer.value)) {
			//if input exist and URL is ok, attempt authorization to specified vault server URL.

			authToVault(vaultServer.value, login.value, pass.value);
		} else {
			notify.textContent = "Bad URL format, please verify";
		}

	} else {
		notify.textContent = "Bad input, must fill in all 3 fields.";
	}
}


function mainLoaded() {
	//this is a <div> element under login button, for notifications like status bar
	var notify = document.getElementById("notify");
	var mounts = document.getElementById("mounts");
	//put listener on login button
	document.getElementById('authButton').addEventListener('click', authButtonClick, false);
}

document.addEventListener('DOMContentLoaded', mainLoaded, false);