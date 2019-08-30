const express = require('express');
const app = express();
const PORT = 2345;
const http = require('http').Server(app);
const db = require('./db');
const { messageModel } = require('./model')

app.use(express.static(__dirname + '/client'));
app.set('view engine', 'ejs');
app.set('views', './client');

const io = require('socket.io')(http);

io.sockets.on('connection', (socket)=>{
    socket.on("chat message", function({msg, room}) {
        console.log("zzzzzzzzzzzz", room)
        if(!room) return;
        const listRooms = socket.adapter.rooms;
        console.log('User joined chat room 1', listRooms);
        io.sockets.in(room).emit("received", { message: '<strong>' + socket.username + ' da chat </strong>: ' + msg  })
        // io.emit("received", { message: '<strong>' + socket.username + ' da chat </strong>: ' + msg  });
        let chatMessage  =  new messageModel({ message: msg, sender: "Anonymous"});
        chatMessage.save();
    });

    socket.on("createRoom", room => {
        socket.join(room);
    })

    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });
    
    socket.on('join_room', function (roomName) {
        try {
            socket.join(roomName);

            const listRooms = socket.adapter.rooms;

            console.log('User joined chat room 1', listRooms);

            const z = io.to(roomName).clients;
            // (function(error,clients){
            //     console.log("zzzzzzzzzzzz", clients)
            //     var numClients=clients.length;
            // });

            console.log("h1111111111111111", socket.id)
        } catch (e) {
            console.log("zzzz", e)
        }
    })

    app.get('/getListRooms', (req, res, next) => {
        console.log("socket.adapter.rooms", socket.adapter.rooms)
        res.json({
            listRooms: socket.adapter.rooms || []
        })
    })
});

app.get('/', (req, res, next) => {
    res.render('index')
});



http.listen(PORT, ()=>{
    console.log('connected to port: '+ PORT)
});
// app.listen(PORT, () => {
//     console.log('Listen port %s', PORT)
// })
