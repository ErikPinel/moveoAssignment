const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});
var userCountObj={}
io.on("connection", (socket) => {
var currentRoom;
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room",async (data) => {
    currentRoom=data;
    console.log('joinroom')
    if(userCountObj[data]==null)
    {
        userCountObj[data]=1
    }
    else{
        userCountObj[data]+=1;
    }


    
   await socket.join(data)
    
    console.log("socket room number"+userCountObj[data])
    emitRoomSize(data,userCountObj[data])
    
  });

  socket.on("send_message", (data) => {
    console.log(data.data+'send_message')
    emitCode(data)
    
  });

  const emitCode=(data)=>socket.to(data.room).emit("receive_message", data.data);
  const emitRoomSize= (room,size)=>socket.to(room).emit("room_size",size)

  socket.on("disconnect", (data) => {console.log('disconnected: '+socket.id); userCountObj[currentRoom]-=1;})

});
 
server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});