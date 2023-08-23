import './App.css';
import io from "socket.io-client";
import {useEffect, useState} from "react";
import Chat from './Chat';

const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if(userName.trim().length > 0 && roomId.trim().length > 0) {
      socket.emit("join_room", roomId);  // emit là gửi sự kiện "join_room" kèm dữ liệu là roomId qua cho server xử lý
      setShowChat(true);
    }
  }

  return (
    <div className="App">
      {!showChat 
      ? 
      (
        <div className='join-chat'>
          <h1>Join a chat</h1>
          <input placeholder="user name..." onChange={(e)=>setUserName(e.target.value)} />
          <input placeholder="room ID..." onChange={(e)=>setRoomId(e.target.value)} />
          <button onClick={joinRoom}>Join</button>
        </div>
      ) 
      :
      (
        <Chat
          socket={socket}
          userName={userName}
          roomId={roomId}
        />
      )
      }

    </div>
  );
}

export default App;
