var io = require('socket.io')(8080);

var fs = require('fs');
var crypto = require('crypto');

var privateKey = fs.readFileSync('key.pem').toString();
var certificate = fs.readFileSync('csr.pem').toString();
var credentials = {key: privateKey, cert: certificate};

var app = require('express')();
var https = require('https').createServer(credentials);
var io = require('socket.io')(https);

https.setSecure(credentials);

https.get('/', function(req, res){
  res.sendfile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('news', 'you connected to the server (localhost)!');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

https.listen(3000, function(){
  console.log('listening on *:3000');
});
