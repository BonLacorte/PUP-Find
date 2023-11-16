require('dotenv').config()
const express = require('express');
const path = require('path')
const http = require('http');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const { logger, logEvents } = require('./middleware/logger')
const app = express();
const PORT = process.env.PORT || 3500

const { chats } = require('./data/data');
const corsOptions = require('./config/corsOption');
const cookieParser = require('cookie-parser');

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors({
    origin: ['https://pup-find-server.vercel.app',],
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(express.json({limit: '70mb'}))
app.use(express.urlencoded({limit: '70mb', extended: true, parameterLimit: 50000}));

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
    res.sendStatus(200).json("Server is running")
})

app.use('/chat', require('./routes/chatRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/user', require('./routes/userRoutes'))
// app.use('/lostitems', require('./routes/lostItemRoutes'))
// app.use('/founditems', require('./routes/foundItemRoutes'))
// app.use('/missingitems', require('./routes/missingItemRoutes'))
app.use('/message', require('./routes/messageRoutes'))
app.use('/report', require('./routes/reportRoutes'))
app.use('/claimedReport', require('./routes/claimedReportRoutes'))
app.use('/dashboard', require('./routes/dashboardRoutes'))

app.all('*', (req, res) => {
res.status(404)
if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
} else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' })
} else {
    res.type('txt').send('404 Not Found')
}
})

app.use(errorHandler)

mongoose.set('strictQuery', false);

const server = app.listen(
    PORT, () => {
        console.log(`Server running on PORT ${PORT}...`)
    }
);


const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        // origin: '*',
        // credentials: true,
        corsOptions
    },
});


// const io = socketIO(server);
// io.origins('*:*'); // Allow all origins, you can restrict it to your specific domain in production
const activeUsersByChat = {}; // Add this variable outside the io.on('connection', ...) block
// Set up Socket.io connections
io.on('connection', socket => {
    console.log('Connected to Socket.io');

    socket.on("setup", (userData) => {
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit("connected")
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("leave chat", (room) => {
        socket.leave(room);
        console.log("User Left Room: " + room);
    })

    // Signal from client when user opens a chat
    socket.on("chat opened", (chatId) => {
        activeUsersByChat[chatId] = socket.userId;
        console.log("Chat opened", {activeUsersByChat})
    });

    // Signal from client when user closes a chat
    socket.on("chat closed", (chatId) => {
        if (activeUsersByChat[chatId] === socket.userId) {
            
            delete activeUsersByChat[chatId];
        }
        console.log("Chat closed", {activeUsersByChat})
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        // For seen function
        chat.users.forEach((user) => {
            // If the `user` is the sender then return(exit)
            if (user._id == newMessageRecieved.sender._id) return;

            // If the `user` is not the sender
            socket.in(user._id).emit("message recieved", newMessageRecieved);

            // Add this block to update User2's last seen message
            if (user._id == chat.users[1]._id) {
                // Send an event to User2 to update their last seen message
                socket.to(user._id).emit("update last seen message", newMessageRecieved);
            }
        });

        // For real-time updating of ChatList's list of chat conversation's latest messages whether the user are online of not and whether the user is the sender of the latest message or not
        chat.users.forEach((user) => {
            socket.in(user._id).emit("update chat list", newMessageRecieved);
        })
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});

// Connect to MongoDB using Mongoose
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    // app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})    

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})

module.exports = app