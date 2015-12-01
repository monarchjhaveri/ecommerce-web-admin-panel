## Generating SSL Certificates

1. `openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem`
2. `openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt`
3. in `.env`, point `HTTPS_KEY_PEM` and `HTTPS_CERT_PEM` to `key.pem` and `server.crt` respectively