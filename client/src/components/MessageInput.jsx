export default function MessageInput({ text, setText, handleSend }) {
  return (
    <div className="p-3 border-t bg-white flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Type a message..."
      />

      <button
        onClick={handleSend}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
      >
        Send
      </button>
    </div>
  );
}