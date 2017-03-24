var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mysql = require('mysql');


var root = __dirname;
var port = 8888;
var serveIndex = require('serve-index');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'chat_angular'
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(root + '/'));
app.use('/', serveIndex(root + '/'));




app.get("/user/connect/:pseudo/:password", function (req, res) {
    var data = {pseudo: req.params.pseudo, password: req.params.password};

    connection.query("SELECT * FROM user WHERE pseudo = ? AND password = ? LIMIT 1 ", [data.pseudo, data.password], function (err, rows) {
        console.log(rows);
        if (err || rows == "") {
            response.valid = false;
            response.message = "user not exist";
            response.data = [];
        } else {
            response.valid = true;
            response.message = "user exist ";
            response.data = rows;
        }
        res.json(response);
    });
});

app.get("/user/inscription/:pseudo/:password", function (req, res) {
    var data = {pseudo: req.params.pseudo, password: req.params.password};

    connection.query("INSERT INTO user set ? ", data, function (err, rows) {
        if (err || rows == "") {
            response.valid = false;
            response.message = "Error while adding the user ";
            response.data = [];
        } else {
            rows.pseudo = data.pseudo;
            response.valid = true;
            response.message = "Success adding user ";
            response.data = rows;
        }
        res.json(response);
    });
});

var response = {
    valid: false,
    message: "",
    data: [],
}



io.on('connection', function (socket) {
//    console.log('User connected');
    socket.emit('chat_message_post', {valid: true, pseudo: "[Server]", message: "Welcome"});
    socket.broadcast.emit('chat_message_post', {valid: true, pseudo: "[Server]", message: 'New user connected!'});

    socket.on('chat_message_post', function (data) {
        console.log('Message:', data);
        var pseudo = data.pseudo;
        delete data.pseudo;

        connection.query("INSERT INTO message set ? ", data, function (err, rows) {
            if (err || rows == "") {
                console.log("error", err);
                response.valid = false;
                response.message = "Error while adding the message ";
                response.from_id = data.from_id;
                io.emit('chat_message_post', response);
            } else {
                response.valid = true;
                response.message = data.message;
                response.pseudo = pseudo;
                response.data = data;
                
                io.emit('chat_message_post', response);
            }
        });

    });





    socket.on('disconnect', function (data) {
//        console.log('User disconnected');
//        socket.broadcast.emit('chat_message', '[Server] ' + data.user.pseudo + ' leaves');
    });
});





http.listen(port, function () {
    console.log('Listening websocket on port ' + port);
});

