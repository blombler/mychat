var http = require('http');
var url = require("url");
var express = require("express");
var app = express();
var path = require("path");
var appDir = path.dirname(require.main.filename);

var messages = [];
var messageTimes = [];
var amountMessageLimit = 10;

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(appDir, 'index.html'));
});

app.get('/jquery', function(req, res) {
    res.sendFile(path.join(appDir, 'node_modules/jquery/dist/jquery.min.js'));
});

app.get('/chat', function(req, res) {
    res.sendFile(path.join(appDir, 'js/chat.js'));
});

app.get('/message/:message', function(req, res) {
    addMessage(req.params.message);
    console.log("Neue Nachricht:",messages);
    console.log("Neue Nachricht:",messageTimes);

    res.end('ok');
});

app.get('/retrieve', function(req, res) {
    var messageData = {messages:messages, messageTime:messageTimes};
    res.end(JSON.stringify(messageData));
});

function addMessage(message) {
  if (message.length > 0) {
    messages.push(message);
    messageTimes.push(new Date().getTime());
  }
  messages = messages.slice(-amountMessageLimit);
  messageTimes = messageTimes.slice(-amountMessageLimit);
}

app.listen(5555);

console.log('Heute : Ready');
