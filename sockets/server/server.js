require('./config/config.js');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
let server = http.createServer(app);
const bodyParser = require('body-parser');
const path = require('path');
const publicPath = path.resolve(__dirname,'../public');

app.use(express.static(publicPath));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.get('/', function (req, res) {
  res.json({
      mensaje:'Hello World'
  })
});

let io = socketIO(server);
io.on('connection',(cliente)=>{
    
    console.log('nuevo usuario:'+cliente.id);

    cliente.on('notificacion',(data)=>{
        console.log('notificacion',data)
        io.emit('nueva_notificacion',data)
    });

    cliente.on('nuevo-ticket',(data)=>{
        console.log('nuevo-ticket',data);
        io.emit('nuevo-ticket',data);
    })
})
server.listen(process.env.PORT,()=>{
    console.log('escuchando puerto:',process.env.PORT);
});