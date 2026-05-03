export default function MessageInput({
  text,
  setText,
  handleSend,
  sending = false,
}) {
  return (
    <div className="p-3 border-t bg-white flex items-center gap-2">
      
      {/* Input */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Type a message..."
      />

      {/* Send Button (Icon) */}
      <button
        onClick={handleSend}
        disabled={sending}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {/* SVG Send Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M22 2L11 13"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M22 2L15 22L11 13L2 9L22 2Z"
          />
        </svg>
      </button>

    </div>
  );
}