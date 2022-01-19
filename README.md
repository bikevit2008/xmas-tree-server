# xmas-tree-server
 WebSocket server on raspberry pi + ws2812 led strip for metaverse Decentraland

## Instructions

### Set TLS certificate
1. You need copy Certificate and Key to directory with project
2. Change names to your names in app.js in ssl_cert_path and ssl_key_path
````js
        this.config = {
            ssl_cert_path: './xmas-cert.pem',
            ssl_key_path: './xmas-privkey.pem'
        }
````
