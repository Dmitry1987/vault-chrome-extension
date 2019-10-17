# The new project location
This project was forked and is evolving at this address: https://github.com/mulbc/vaultPass

This repository is old, please follow the development process at the link above. 
You can also install the plugin from the Chrome web store.

Thanks @mulbc for working on this plugin!


# vault-chrome-extension
Attempt in creating chrome extension for Hashicorp Vault

A project started on a Hackathon @ ironSource, the company I work for right now.
During free time I will attempt to finalize this into a complete usable Chrome extension,
that allows interaction with Hashicorp Vault server.

### Current features:
1. Connect to Vault and get Token
2. Get list of potential credentials in Popup
3. Select credentials from popup and have them filled into the website

### Requirements
Vault needs to be prepared to use this extention.
This extention expects secrets to be saved in the 'secret' mount path (the default KV store).
The path in this mount should be `/vaultPass/[someOrg]/url` where:

* `someOrg` will be some organisational level in your company to separate access levels
  * You can activate and deactivate these "folders" in options
* `url` is a URL or part of it that the credentials should match for
  * Be aware that Vault does NOT support * characters (and potentially others...) as names!
  * It should have _at least_ the keys `username` and `password` with the respective information
* Get a Token via the options page of this extention

### TODO:
* Create application specific Token instead of using the user-token
* Nicer UI
* Write (new) credentials to Vault
* Remove synchronous GET request for credentials in popup.js

### Notes
Tested with Vault 1.0.0
