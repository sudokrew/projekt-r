var fs = require('fs');

var key = fs.readFileSync('key.pem');
var cert = fs.readFileSync('cert.pem');

var credentials = {
  key: key,
  cert: cert
};

// https.createServer(options, function (req, res) {
//     res.writeHead(200);
//     res.end("Hi from HTTPS");
// }).listen(8000);

var server = require('express')();
var http = require('http').Server(server);
var https = require('https').createServer(credentials, server);
var io = require('socket.io')(https);

https.listen(3000, function(){
  console.log('listening on *:3000');
});

server.get('/', function(req, res){
  res.sendfile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('news', 'you connected to the server (localhost)!');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

