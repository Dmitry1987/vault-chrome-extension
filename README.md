# vault-chrome-extension
Attempt in creating chrome extension for Hashicorp Vault

A project started on a Hackathon @ ironSource, the company I work for right now.
During free time I will attempt to finalize this into a complete usable Chrome extension,
that allows interaction with Hashicorp Vault server.

Current features:
1. login to remote\local server
2. viewing all mounts in vault
3. reading and writing secrets

TODO:
add listing secrets option (new Vault allows finally to list all secrets in mount)
add option to write and read long multiline values, for now it allows only 1 line.
need to support 'seal' option i guess... not sure though.. it's extension for users of Vault, not for Admins (admins better seal/unseal stuff in CLI ...)
