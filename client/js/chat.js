var socket = io();
var messages = document.getElementById("messages");

(async function() {
    $("form").submit(function(e) {
        console.log("aaaaaaaaaaaaaaaa", socket.id)

        let li = document.createElement("li");
        e.preventDefault(); // prevents page reloading
        socket.emit("chat message", {msg: $("#message").val(), room: $("#txtJoinRoomName").val()});
        $("#message").val("");
        return false;
    });

    socket.on('is_online', function(username) {
        $('#online').append($('<li>').html(username));
    });

    socket.on('event_user_joined', function(username) {
        $('#online').append($('<li>').html(username));
    });

    socket.emit('user_joined', function (id) {
        console.log("user_joined", id)
    })

    socket.on("received", data => {
        $('#messages').append($('<li>').html(data.message));
        console.log("Hello bingo!");
    });

    $("#btnCreateRoom").on('click', function () {
        const roomName = $("#txtRoomName").val();
        console.log(roomName)
        createRoom(roomName)
    })

    $("#btnJoinRoom").on('click', function () {
        const roomName = $("#txtJoinRoomName").val();
        joinRoom(roomName)
    })

    function createRoom(room) {
        socket.emit('createRoom', room);
    }

    function joinRoom(room) {
        socket.emit('join_room', room);
    }

    function listensCreatedRoom() {
        socket.on('listensCreatedRoom', function (room) {
            socket.join(room);
        });
    }

    async function getRooms() {
        const data = await axios.get("http://localhost:2345/getListRooms");
        return data;
    }
    const listRooms = await getRooms();
    console.log(listRooms)

    var username = prompt('Please tell me your name');
    socket.emit('username', username);
})();

// fetching initial chat messages from the database
(function() {
    fetch("/chats")
        .then(data => {
            return data.json();
        })
        .then(json => {
            json.map(data => {
                let li = document.createElement("li");
                let span = document.createElement("span");
                messages.appendChild(li).append(data.message);
                messages
                    .appendChild(span)
                    .append("by " + data.sender + ": " + formatTimeAgo(data.createdAt));
            });
        });
})();

//is typing...

let messageInput = document.getElementById("message");
let typing = document.getElementById("typing");

//isTyping event
messageInput.addEventListener("keypress", () => {
    socket.emit("typing", { user: "Someone", message: "is typing..." });
});

socket.on("notifyTyping", data => {
    typing.innerText = data.user + " " + data.message;
    console.log(data.user + data.message);
});

//stop typing
messageInput.addEventListener("keyup", () => {
    socket.emit("stopTyping", "");
});

socket.on("notifyStopTyping", () => {
    typing.innerText = "";
});