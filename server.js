const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { userJoin, removeUser, getCurrentUser, getRoomUsers } = require('./utils/users');
const formatMessage = require('./utils/messages');

const app = express();
port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // origin: "*"
        origin: "https://onchat-react.netlify.app/",
        methods: ["POST", "GET", "DELETE", "PUT"]
    }
});

app.get('/', (req, res) => {
    res.send({
        "message": "Hello from Server",
        "nikhil": "hello Nikhil!",
        "method": "adding cors: '*' "
    });
});

server.listen(port, () => {
    console.log("server is running at http://localhost:" + port)
});


botname = "Onchatter bot"
io.on('connection', socket => {

    console.log("New WS Connection");

    //Receiving the user-details from server
    socket.on('user-details', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        
        // For Commmon room where room != India
        socket.join(user.room);

        // Displaying new user 
        console.log(`New-User in ${user.room}`, user);

        // Welcome current user (It will show message only on current user UI #emit)
        socket.emit('message', formatMessage(botname, "Welcome to Onchatter"));

        // Broadcast when a user connects (it will send messages to other room users other than current one)
        socket.broadcast.to(user.room).emit('message', formatMessage(botname, `${user.username} has joined the chat`));

        // Sending users and room info
        io.to(user.room).emit('room-users', {
            sRoom: user.room,
            sUsers: getRoomUsers(user.room)
        })

    });

    // Listen for chat message
    socket.on('chat-message', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })


    // Runs when client disconnect
    socket.on('disconnect', () => {
        const leftUser = getCurrentUser(socket.id);
        if (leftUser) {
            io.to(leftUser.room).emit('message', formatMessage(botname, `${leftUser.username} left the chat`));
        }

        // Removing a user from users array
        const activeUsers = getRemaining(leftUser);
        console.log(leftUser.username + " left the chat");
        console.log(`${activeUsers.length} remaining users in #${leftUser.room} room`)

        // Send users and room info
        io.to(leftUser.room).emit('room-users', {
            sRoom: leftUser.room,
            sUsers: activeUsers
        });

    })

    const getRemaining = (leftUser) => {
        const activeUsers2 = removeUser(leftUser.id);
        // console.log(activeUsers2)
        return activeUsers2;
    }

});       


module.exports = app;