import { useEffect, useState, useRef } from "react";
import socket from "../socket/socket";
import { getMessages, sendMessage } from "../services/api";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow({ user, selectedUser, setUnread }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // fetch messages
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      const data = await getMessages(user._id, selectedUser._id);
      setMessages(data);
    };

    fetchMessages();
  }, [selectedUser, user]);

  // socket
  useEffect(() => {
    const handleReceive = (msg) => {
      if (
        msg.sender === selectedUser?._id ||
        msg.receiver === selectedUser?._id
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      } else {
        setUnread((prev) => ({
          ...prev,
          [msg.sender]: (prev[msg.sender] || 0) + 1,
        }));
      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [selectedUser, setUnread]);

  // send message
  const handleSend = async () => {
    if (!text || !selectedUser || sending) return;

    setSending(true);

    const msgData = {
      sender: user._id,
      receiver: selectedUser._id,
      message: text,
    };

    const savedMsg = await sendMessage(msgData);

    setMessages((prev) => [...prev, savedMsg]);
    socket.emit("sendMessage", savedMsg);

    setText("");
    setSending(false);
  };

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">

      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
          {selectedUser.username[0]}
        </div>
        <div>
          <p className="font-semibold">{selectedUser.username}</p>
          <p className="text-xs text-gray-500">Online</p>
        </div>
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
        sending={sending}
      />
    </div>
  );
}