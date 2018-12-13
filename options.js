// invoked after user clicks "login to vault" button, if all fields filled in, and URL passed regexp check.
function authToVault(myurl, username, password) {
	notify.textContent = "Login attempt: " + myurl + "/v1/auth/userpass/login/" + username;
	jQuery.ajax({
		type: "POST",
		url: myurl + "/v1/auth/userpass/login/" + username,
		data: JSON.stringify({ password: password }),
		contents: "json",
		dataType: "json",
		success: function (data) {
			notify.textContent = "AUTH SUCCESS, token: " + data.auth.client_token;
			// set global token for other functions
			localStorage.userToken = data.auth.client_token
			localStorage.vaultUrl = myurl
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