export default function MessageBubble({ msg, isMe, formatTime }) {
  return (
    <div className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs shadow ${
          isMe
            ? "bg-green-300 text-black"
            : "bg-white text-black border"
        }`}
      >
        <p>{msg.message}</p>

        <p className="text-[10px] text-gray-600 mt-1 text-right">
          {msg.timestamp ? formatTime(msg.timestamp) : ""}
        </p>
      </div>
    </div>
  );
}