var http = require('http');
var url = require("url");
var express = require("express");
var app = express();
var path = require("path");
var appDir = path.dirname(require.main.filename);

var messages = [];
var messageTimes = [];
var messageUsers = [];
var amountMessageLimit = 10;
// {ip:"192.168.0.1",username:"Timgfvghgdtzzcxsdt"}
var chatUsers = [];

app.enable('trust proxy');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    for (var i = 0; i < chatUsers.length; i++) {
      if (chatUsers[i].ip == req.ip) {
        res.sendFile(path.join(appDir, 'index.html'));
        return;
      }
    }

    res.sendFile(path.join(appDir, 'login.html'));
});

app.get('/jquery', function(req, res) {
    res.sendFile(path.join(appDir, 'node_modules/jquery/dist/jquery.min.js'));
});

app.get('/chat', function(req, res) {
    res.sendFile(path.join(appDir, 'js/chat.js'));
});

app.get('/login', function(req, res) {
    res.sendFile(path.join(appDir, 'js/login.js'));
});

app.get('/message/:message', function(req, res) {
  if (isLoggedIn(req.ip)) {
    console.log("Die userIp" + req.ip);
    var username = "";
    for (var i = 0; i < chatUsers.length; i++) {
      if (req.ip == chatUsers[i].ip) {
        username = chatUsers[i].username;
        break;
      };
    }
    addMessage(req.params.message, username);
    console.log("Neue Nachricht:",messages);
    console.log("Neue Nachricht:",messageTimes);
    res.end();
  } else {
    res.status(401).end();
  }
});

app.get('/login/:username', function(req, res) {
  var isReplaced = false;
  for (var i = 0; i < chatUsers.length; i++) {
    if (req.ip == chatUsers[i].ip) {
      chatUsers[i].username = req.params.username;
      isReplaced = true;
      break;
    };
  }
  if (!isReplaced) {
    chatUsers.push({
      ip: req.ip,
      username: req.params.username
    });
  }

  console.log(chatUsers);
  res.end('ok');
});

app.get('/retrieve', function(req, res) {
    if (isLoggedIn(req.ip)) {
      var messageData = {
        messages:messages,
        messageTimes:messageTimes,
        messageUsers:messageUsers
      };
      res.end(JSON.stringify(messageData));
    } else {
      res.status(401).end();
    }
});

function isLoggedIn(ip) {
  for (var i = 0; i < chatUsers.length; i++) {
    if (chatUsers[i].ip == ip) {
      return true;
    }
  }
  return false;
}

function addMessage(message, username) {
  if (message.length > 0) {
    messages.push(message);
    messageTimes.push(new Date().getTime());
    messageUsers.push(username);
  }
  messageUsers = messageUsers.slice(-amountMessageLimit);
  messages = messages.slice(-amountMessageLimit);
  messageTimes = messageTimes.slice(-amountMessageLimit);
}

app.listen(5555);

console.log('Heute : Ready');
