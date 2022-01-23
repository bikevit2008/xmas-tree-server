# xmas-tree-server
 WebSocket server on raspberry pi + ws2812 led strip for metaverse Decentraland
 
#### Here client code to interaction with server https://github.com/bikevit2008/xmas-tree-dcl

## Instructions

### Use sudo
1. For access to GPIO by library you need start your server code by super-user
````shell
sudo node app.js
````

### Set TLS certificate (Required)
1. You need copy Certificate and Key to directory with project
2. Change names to your names in app.js in ssl_cert_path and ssl_key_path
````js
        this.config = {
            ssl_cert_path: './xmas-cert.pem',
            ssl_key_path: './xmas-privkey.pem'
        }
````

### Do auto-startup by PM2
1. You need global installed PM2
2. You need use theese commands
````shell
pi@raspberrypi:~/xmas-tree-server $ pm2 start npm --name tree_server  -- start
pi@raspberrypi:~/xmas-tree-server $ sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u pi --hp /home/pi
pi@raspberrypi:~/xmas-tree-server $ pm2 save
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
