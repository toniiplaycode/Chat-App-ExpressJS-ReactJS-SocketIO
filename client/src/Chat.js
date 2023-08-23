import { useEffect, useState } from "react"
import ScrollToBottom from 'react-scroll-to-bottom'; // auto scroll xuống khi có message mới

const Chat = ({socket, userName, roomId}) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if(currentMessage.trim().length > 0) {
            const messageData = {
                roomId: roomId,
                author: userName,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds()
            }

            
            await socket.emit("send_message", messageData);

            setMessageList((prev) => [...prev, messageData]);

            setCurrentMessage("");
        }
    }

    useEffect(() => {
        const receiveMessageHandler = (data) => {
            setMessageList((prev) => [...prev, data]);
        };
    
        socket.on("receive_message", receiveMessageHandler);
    
        return () => { // dùng cleaup và socket.off (bỏ sự kiện lắng nghe) để không bị gọi lặp lại
            socket.off("receive_message", receiveMessageHandler);
        };
    }, [socket]);
    
    useEffect(() => {
        console.log(messageList);
    }, [messageList])


    return(
        <div className="chat-container">
            <div className="chat-header">
                <p>Live chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="auto-scroll-bottom">
                    {messageList.map(message => {
                            return (
                                <div className = {userName===message.author ? "message you" : "message other"}>
                                    <div className="message-content">
                                        <p>{message.message}</p>
                                    </div>
                                    <div className="message-info">
                                        <p className="info-time">{message.time}</p>
                                        <p className="info-author">{message.author}</p>
                                    </div>
                                </div>
                            )
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input
                    placeholder="Type a message..."
                    value={currentMessage}
                    onChange={(e)=>setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => {
                        e.key === "Enter" && sendMessage()
                    }}
                />
                <button 
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default Chat