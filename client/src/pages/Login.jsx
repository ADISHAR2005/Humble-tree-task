import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data));
      onLogin(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4">

      <div className="w-full max-w-sm bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-10 shadow-sm flex flex-col">

        {/* Logo */}
        <div className="w-11 h-11 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 mb-5">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        <h1 className="text-[22px] font-semibold text-gray-800 mb-1.5">
          Welcome back
        </h1>
        <p className="text-[13px] text-gray-500 mb-7">
          Enter your username to continue
        </p>

        {/* Input */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[11px] font-mono tracking-[0.06em] text-gray-400 uppercase">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
            className="bg-gray-100 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 mb-3">{error}</p>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading || !username.trim()}
          className="w-full bg-[#6d5dfc] text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center hover:bg-[#5b4af0] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Login"
          )}
        </button>

      </div>
    </div>
  );
}