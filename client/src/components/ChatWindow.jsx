import { useEffect, useRef, useState } from "react";
import socket from "../socket/socket";

export default function ChatWindow({ user, selectedUser, setUnread }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

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

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (
        msg.sender === selectedUser?._id ||
        msg.receiver === selectedUser?._id
      ) {
        setMessages((prev) => [...prev, msg]);
        setIsTyping(false);
      } else {
        setUnread?.((prev) => ({
          ...prev,
          [msg.sender]: (prev[msg.sender] || 0) + 1,
        }));
      }
    });
    return () => socket.off("receiveMessage");
  }, [selectedUser, setUnread]);

  const handleSend = async () => {
    if (!text.trim() || !selectedUser) return;
    const msgData = {
      sender: user._id,
      receiver: selectedUser._id,
      message: text.trim(),
    };
    const res = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgData),
    });
    const savedMsg = await res.json();
    setMessages((prev) => [...prev, savedMsg]);
    socket.emit("sendMessage", savedMsg);
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const grouped = messages.reduce((acc, msg) => {
    const date = new Date(msg.timestamp).toLocaleDateString([], {
      weekday: "long", month: "short", day: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-[#0f0f11]">
        <div className="w-14 h-14 rounded-2xl bg-[#22222a] flex items-center justify-center text-[#9896b0]">
          <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p className="text-[15px] font-medium text-[#9896b0]">No conversation selected</p>
        <p className="text-xs text-[#5c5a70]">Pick someone from the sidebar to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0f0f11] min-w-0">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.07] bg-[#18181c] shrink-0">
        <div className="w-10 h-10 rounded-full bg-[rgba(124,106,247,0.15)] text-[#9d8ef9] flex items-center justify-center text-sm font-semibold shrink-0">
          {getInitials(selectedUser.username)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#f0effe] truncate">{selectedUser.username}</p>
        
        </div>
    
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 [scrollbar-width:thin] [scrollbar-color:#2a2a35_transparent]">
        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="text-[10px] font-mono text-[#5c5a70] whitespace-nowrap">{date}</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            {msgs.map((msg, i) => {
              const isMe = msg.sender === user._id;
              return (
                <div key={i} className={`flex mb-1 ${isMe ? "justify-end" : "justify-start"}`}>
                  <div>
                    <div
                      className={`max-w-xs px-3 py-2 text-[13px] leading-relaxed wrap-break-word
                        ${isMe
                          ? "bg-[#2d2a52] text-[#d4cfff] border border-[rgba(124,106,247,0.2)] rounded-2xl rounded-br-sm"
                          : "bg-[#1e1e26] text-[#c8c6dc] border border-white/[0.07] rounded-2xl rounded-bl-sm"
                        }`}
                    >
                      {msg.message}
                    </div>
                    <p className={`text-[10px] font-mono text-[#5c5a70] mt-1 ${isMe ? "text-right" : "text-left"}`}>
                      {msg.timestamp ? formatTime(msg.timestamp) : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3.5 py-3 border-t border-white/[0.07] bg-[#18181c] shrink-0">
        <input
          className="flex-1 bg-[#22222a] border border-white/13 rounded-xl px-4 py-2.5 text-[13px] text-[#f0effe] placeholder-[#5c5a70] outline-none focus:border-[#7c6af7] transition-colors"
          type="text"
          placeholder={`Message ${selectedUser.username}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
        />

        <button
          onClick={handleSend}
          className="w-9 h-9 rounded-xl bg-[#7c6af7] flex items-center justify-center shrink-0 hover:bg-[#5e4fe8] active:scale-95 transition-all cursor-pointer"
        >
          <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

    </div>
  );
}