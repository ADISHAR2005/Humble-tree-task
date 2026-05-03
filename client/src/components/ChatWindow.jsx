import { useEffect, useState, useRef } from "react";
import socket from "../socket/socket";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow({ user, selectedUser, setUnread }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  //  format time
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  //  fetch messages
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      const res = await fetch(
        `http://localhost:5000/api/messages/${user._id}/${selectedUser._id}`
      );
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();
  }, [selectedUser, user]);

  // ⚡ socket listener
  useEffect(() => {
    const handleReceive = (msg) => {
      // if current chat → show message
      if (
        msg.sender === selectedUser?._id ||
        msg.receiver === selectedUser?._id
      ) {
        setMessages((prev) => {
          // prevent duplicates
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      } else {
        // update unread count
        setUnread((prev) => ({
          ...prev,
          [msg.sender]: (prev[msg.sender] || 0) + 1,
        }));
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => socket.off("receiveMessage", handleReceive);
  }, [selectedUser, setUnread]);

  //  send message
  const handleSend = async () => {
    if (!text || !selectedUser) return;

    const msgData = {
      sender: user._id,
      receiver: selectedUser._id,
      message: text,
    };

    // save to DB
    const res = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msgData),
    });

    const savedMsg = await res.json();

    // show immediately (sender side)
    setMessages((prev) => [...prev, savedMsg]);

    // send via socket
    socket.emit("sendMessage", savedMsg);

    setText("");
  };

  //  auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b bg-white shadow font-semibold text-lg">
        {selectedUser.username}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            msg={msg}
            isMe={msg.sender === user._id}
            formatTime={formatTime}
          />
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <MessageInput
        text={text}
        setText={setText}
        handleSend={handleSend}
      />
    </div>
  );
}