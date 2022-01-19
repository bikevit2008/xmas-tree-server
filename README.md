# xmas-tree-server
 WebSocket server on raspberry pi + ws2812 led strip for metaverse Decentraland

## Instructions

### Set TLS certificate
1. You need copy Certificate and Key to this directory
“Certificate is saved at: /etc/letsencrypt/live/test-xmas.maff.io/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/test-xmas.maff.io/privkey.pem”
2. Change names in app.js
````js
        this.config = {
            ssl_cert_path: './xmas-cert.pem',
            ssl_key_path: './xmas-privkey.pem'
        }
````
