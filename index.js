const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('./config/db');  // Kết nối đến MongoDB từ file config
const generateImageRoute = require('./routes/generateImageRoute');
const socketHandler = require('./socket/socketHandler');
const homeRoute  = require('./routes/homeRoute')
const userRoute = require('./routes/userRoute');
const notiRoute = require('./routes/notiRoute');
const postRoute = require('./routes/postRoute');
const checkToken = require('./midleware/index')
require('dotenv').config(); // should be at the very top!!!

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(checkToken)

app.use('/api/generate', generateImageRoute);

app.use('/home', homeRoute)

app.use('/api', userRoute)

app.use('/post', postRoute)

app.use('/noti', notiRoute)


socketHandler(io);

server.listen(4000, () => {
    console.log("The Server is Running on Port 4000");
});