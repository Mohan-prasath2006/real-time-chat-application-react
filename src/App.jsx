import { useState } from "react";
import "./index.css";
import { useRef } from "react";
import io from "socket.io-client";

function App(){
  const [joined,setJoined] = useState(false);
  const [username,setUsername] = useState("");
  const socketRef = useRef(null);
  const [users,setUsers] = useState([]);
  const [messages,setMessages] = useState([]);
  const [message,setMessage] = useState("");

  const joinchat = () =>{
    if(username.trim()){
      socketRef.current = io("https://real-time-chat-backend-q4ov.onrender.com");      socketRef.current.emit("join",username);
      socketRef.current.on("users",handleUserupdate);
      socketRef.current.on("message",handleNewmessage);
      setJoined(true);
    }
  };

  const handleUserupdate = (userlist) => {
    setUsers(userlist);
  }

  const handleNewmessage = (message) => {
    setMessages((prevMessages) => [message, ...prevMessages]);
  }

  const sendMessage = () => {
    if(message.trim()){
      socketRef.current.emit("sendMessage",{username,message});
      setMessage("");
    }
  }

  const logout = () => {
    if(socketRef.current){
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setMessage("");
    setJoined(false);
    setMessages([]);
    setUsername("");
    setUsers([]);
  };

  return(
    <div className="chat-container">
      {
        !joined ? (
          <div className="chat-header">
            <h2>Enter Your Name</h2>
            <div className="username-input">
              <input 
              type="text"
              placeholder="username..."
              value={username}
              onChange={(e)=> setUsername(e.target.value)}
              />

              <button onClick={joinchat}>
                Join Chat
              </button>
            </div>
          </div>
        ):(
          <>
            <div className="chat-header joined">
              <div>Welcome, {username}</div>
              <button onClick={logout}>Logout</button>
            </div>

            <div className="users">
              <strong>Online Users:</strong> {users.join(", ")}
            </div>

            <div className="message-list">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`message ${msg.username === username ? "me ": ""}${
                    msg.message.includes("joineed the chat.") || 
                    msg.message.includes("has left the chat.")
                     ? "system"
                     : ""
                  }`}
                >
                  <strong>{msg.username}:</strong> {msg.message}
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
              type="text"
              placeholder="Type a Message"
              onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        )
      }
    </div>
  );
}

export default App;