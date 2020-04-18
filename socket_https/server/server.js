require('./config/config.js');
const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');
const publicPath = path.resolve(__dirname,'../public');

const fs = require( 'fs' );
// const app = require('express')();
const app = express();
const https = require('https');
const server = https.createServer({
    key: fs.readFileSync('/etc/apache2/ssl/apache.key'),
    cert: fs.readFileSync('/etc/apache2/ssl/apache.crt'),
    requestCert: false,
    rejectUnauthorized: false
},app);

app.use(express.static(publicPath));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


server.listen(process.env.PORT,()=>{
    console.log('escuchando puerto:',process.env.PORT);
});


var io = require('socket.io').listen(server);

io.sockets.on('connection',function (cliente) {
    console.log('nuevo usuario:'+cliente.id);

    cliente.on('notificacion',(data)=>{
        console.log('notificacion',data)
        io.emit('nueva_notificacion',data)
    });

    cliente.on('nuevo-ticket',(data)=>{
        console.log('nuevo-ticket',data);
        io.emit('nuevo-ticket',data);
    })
});

app.get("/", function(request, response){
    res.json({
        mensaje:'Hello World'
    })
});
