const {WebSocketServer} = require("ws");
const HttpsServer = require('https').createServer;
const fs = require("fs");
const Strip = require('./strip')


function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }





class MyWebSocketServer {
    constructor(port, heartBeatDelay){
        //test config
        // this.config = {
        //     ssl_cert_path: './fullchain1.pem',
        //     ssl_key_path: './privkey1.pem'
        // }
        // prod config
        this.config = {
            ssl_cert_path: './xmas-cert.pem',
            ssl_key_path: './xmas-privkey.pem'
        }
        this.port = port || 3000
        this.server = HttpsServer({
            cert: fs.readFileSync(this.config.ssl_cert_path, 'utf8'),
            key: fs.readFileSync(this.config.ssl_key_path, 'utf8')
        })
        // this.wss = new WebSocket.Server({port: this.port})
        this.wss = new WebSocketServer({server: this.server})
        this.wss.on('connection', this.handleConnection.bind(this))
        this.heartBeatDelay = heartBeatDelay || 15000
        this.intervalHeartBeat = setInterval(()=>{
            //ping all clients
            this.wss.clients.forEach((client)=>{
                //if client status isAlive false then close connection
                if (client.isAlive === false) return client.terminate()

                //set client status isAlive false
                client.isAlive = false
                //send ping to that client and waiting
                client.ping()
            })
        }, this.heartBeatDelay)
        this.wss.on('close', ()=>clearInterval(this.intervalHeartBeat))
        this.strip = new Strip(180)
        this.countInGroup = 30

        this.groups = {}
        for(let i = 0; i < 6; i++){
            //set once random colors for groups
            let red = randomInteger(0, 255)
            let green = randomInteger(0, 255)
            let blue = randomInteger(0, 255)


            this.groups[`setAllLedsGroup${i}`] = {red: red, green: green, blue: blue}
            let startsPos = i*this.countInGroup
            let endsPos = i*this.countInGroup+this.countInGroup


            this.strip.setFromTo(startsPos, endsPos, red, green, blue)
        }

        this.server.listen(this.port)
    }
    handleConnection(client){
        //send all groups data when connects new client
        client.send(JSON.stringify({groups: this.groups}))

        client.isAlive = true

        client.on('pong', ()=>{
            client.isAlive = true
        })
        client.on('message', (message)=>{
            //JSON parse
            try{
                let messageParsed = JSON.parse(message)
                let { method, data } = messageParsed

                switch(method){
                    case 'setAllDefault':
                        this.strip.setAllDefault()
                    break
                    case 'setAllLedsOneColorRandom':
                        this.strip.setAllLedsOneColorRandom()
                    break
                    case 'setRandomCountWithRandomColor':
                        this.strip.setRandomCountWithRandomColor()
                    break
                    case 'setAllLeds': {
                        let { red, green, blue } = data
                        if(red >= 0 && green >= 0 && blue >= 0)
                            this.strip.setAllLeds(red, green, blue)
                        else {
                            let errMessage = {success: false, errorMessage: 'i need know red, green and blue values'}
                            client.send(JSON.stringify(errMessage))
                        }
                        break
                    }
                    case 'setFromTo':{
                        let { startsPos, endsPos, red, green, blue } = data

                        if(startsPos >= 0 && endsPos >= 0 && red >= 0 && green >= 0 && blue >= 0)
                            this.strip.setFromTo(startsPos, endsPos, red, green, blue)
                        else {
                            let errMessage = {success: false, errorMessage: 'i need know startsPos, endsPos, red, green and blue values'}
                            client.send(JSON.stringify(errMessage))
                        }
                        break
                    }
                    default:{
                        if(this.groups[method] !== undefined){
                            let { red, green, blue } = data

                            let group = method.replace('setAllLedsGroup', '')
                            let i = parseInt(group)

                            this.groups[`setAllLedsGroup${i}`] = {red: red, green: green, blue: blue}
                            let startsPos = i*this.countInGroup
                            let endsPos = i*this.countInGroup+this.countInGroup

                            
                            this.groups[method] = {red: red, green: green, blue: blue}
                            this.strip.setFromTo(startsPos, endsPos, red, green, blue)
                        }
                        else{
                            let errMessage = {success: false, errorMessage: 'unknown method'}
                            client.send(JSON.stringify(errMessage))
                        }
                    }
                }


            }catch(e){
                //Catched parse error
                let errMessage = {success: false, errorMessage: 'JSON parse error'}
                client.send(JSON.stringify(errMessage))
            }
        })

    }

}

const wss = new MyWebSocketServer()
