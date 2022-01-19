# xmas-tree-server
 WebSocket server on raspberry pi + ws2812 led strip for metaverse Decentraland

## Instructions

### Set TLS certificate (Required)
1. You need copy Certificate and Key to directory with project
2. Change names to your names in app.js in ssl_cert_path and ssl_key_path
````js
        this.config = {
            ssl_cert_path: './xmas-cert.pem',
            ssl_key_path: './xmas-privkey.pem'
        }
````

### Set led strip length and count leds in one group if you need (Optional)
1. In app.js here you can change led strip length
````js
        this.strip = new Strip(180)
````
2. In app.js here you can change count leds per group
````js
        this.countInGroup = 30
````
