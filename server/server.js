import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors());

const server = http.createServer(app); // dùng http.createServer để tạo server

const io = new Server(server, { 
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);

    socket.on("join_room", (data) => { // data được truyền bên client là roomId
        socket.join(data);
        console.log(`user connected '${socket.id}' with room id '${data}'`);
    });

    socket.on("send_message", (data) => { // data được truyền bên client là messageData
        socket.to(data.roomId).emit("receive_message", data); // gửi messageData lại cho client
        console.log("send_message: ", data);
    });

    socket.on("disconnect", () => { // khi đóng hoặc load tab bên client thì sự kiện disconnect sẽ được gọi
        console.log("user disconnected: ", socket.id);
    });
    // socket.id được random khi được gọi
})

server.listen(3001, () => {
    console.log("server running!");
})

