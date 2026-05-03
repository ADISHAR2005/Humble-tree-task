import { useEffect, useState } from "react";

const AVATAR_COLORS = [
  { bg: "bg-[rgba(124,106,247,0.15)]", text: "text-[#9d8ef9]" },
  { bg: "bg-[rgba(52,211,153,0.12)]",  text: "text-[#34d399]" },
  { bg: "bg-[rgba(248,113,113,0.12)]", text: "text-[#f87171]" },
  { bg: "bg-[rgba(251,191,36,0.12)]",  text: "text-[#fbbf24]" },
  { bg: "bg-[rgba(56,189,248,0.12)]",  text: "text-[#38bdf8]" },
  { bg: "bg-[rgba(167,139,250,0.12)]", text: "text-[#a78bfa]" },
];

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const getColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export default function Sidebar({ user, onLogout, onSelectUser, unread = {}, selectedUser }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data.filter((u) => u._id !== user._id));
    };
    fetchUsers();
  }, [user]);

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-68 min-w-68 bg-[#18181c] flex flex-col border-r border-white/[0.07]">

      {/* Header */}
      <div className="px-4 pt-4.5 pb-3.5 border-b border-white/[0.07]">
        <p className="text-[10px] font-mono tracking-widest text-[#5c5a70] uppercase mb-2">
          Messages
        </p>
        <div className="flex items-center gap-2.5">
          <div className="w-7.5 h-7.5 rounded-full bg-[rgba(124,106,247,0.15)] border-[1.5px] border-[#7c6af7] flex items-center justify-center text-[10px] font-semibold text-[#7c6af7] shrink-0">
            {getInitials(user.username)}
          </div>
          <span className="text-[13px] font-medium text-[#f0effe]">{user.username}</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-1.5 relative">
        <div className="absolute left-5.5 top-1/2 -translate-y-1/2 text-[#5c5a70] pointer-events-none flex items-center">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#22222a] border border-white/13 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#f0effe] placeholder-[#5c5a70] outline-none focus:border-[#7c6af7] transition-colors"
        />
      </div>

      {/* Section label */}
      <p className="px-4 pt-1 pb-2 text-[10px] font-mono tracking-[0.08em] text-[#5c5a70] uppercase">
        Direct Messages
      </p>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filtered.map((u) => {
          const color = getColor(u.username);
          const isActive = selectedUser?._id === u._id;
          const count = unread[u._id] || 0;

          return (
            <div
              key={u._id}
              onClick={() => onSelectUser(u)}
              className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer transition-colors mb-0.5
                `}
            >
              {/* Avatar */}
              <div className={`relative w-9.5 h-9.5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${color.bg} ${color.text}`}>
                {getInitials(u.username)}
                {/* <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#34d399] border-[1.5px] border-[#18181c]" /> */}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-medium truncate ${isActive ? "text-[#f0effe]" : "text-[#9896b0]"}`}>
                  {u.username}
                </p>
                <p className="text-[11px] text-[#5c5a70] truncate mt-0.5">
                  {isActive ? "Active now" : "Tap to chat"}
                </p>
              </div>

              {/* Unread badge */}
              {count > 0 && (
                <span className="bg-[#7c6af7] text-white text-[10px] font-semibold min-w-4.5 h-4.5 rounded-full flex items-center justify-center px-1.5 shrink-0">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-xs text-[#5c5a70] text-center py-6">No users found</p>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.07]">
        <button
          onClick={onLogout}
          className="w-full bg-transparent border border-[rgba(248,113,113,0.3)] text-[#f87171] text-xs font-medium py-2.5 rounded-lg hover:bg-[rgba(248,113,113,0.08)] transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </div>

    </aside>
  );
}