var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function (socket) {
console.log('Client connected.'); // logs new client joining session.

socket.on('draw', function(position) {
       console.log('Received drawing', position);
       socket.broadcast.emit('draw', position);
});
socket.on('theCurrentGuess', function(theCurrentGuess){
       console.log('guess Received', theCurrentGuess);
       socket.broadcast.emit('theCurrentGuess', theCurrentGuess); //Broadcast the guess event to all of the other clients
});
socket.on('disconnect', function() {
       console.log('A user has disconnected');
   });

});

server.listen(process.env.PORT || 8080);
