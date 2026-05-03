import { useEffect, useState } from "react";
import { getUsers } from "../services/api.js";

const AVATAR_COLORS = [
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-green-100", text: "text-green-600" },
  { bg: "bg-red-100", text: "text-red-500" },
  { bg: "bg-yellow-100", text: "text-yellow-600" },
  { bg: "bg-sky-100", text: "text-sky-600" },
  { bg: "bg-indigo-100", text: "text-indigo-600" },
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
      const data = await getUsers();
      setUsers(data.filter((u) => u._id !== user._id));
    };
    fetchUsers();
  }, [user]);

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-68 min-w-68 bg-[#fafafa] flex flex-col border-r border-gray-200 shadow-sm">

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-[11px] font-semibold text-purple-600">
            {getInitials(user.username)}
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {user.username}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-2 relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
        />
      </div>

      {/* Users */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {filtered.map((u) => {
          const color = getColor(u.username);
          const isActive = selectedUser?._id === u._id;
          const count = unread[u._id] || 0;

          return (
            <div
              key={u._id}
              onClick={() => onSelectUser(u)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition
              ${
                isActive
                  ? "bg-[#ede9fe] border border-[#ddd6fe]"
                  : "hover:bg-gray-200/60"
              }`}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${color.bg} ${color.text}`}>
                {getInitials(u.username)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isActive ? "text-gray-900" : "text-gray-700"}`}>
                  {u.username}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isActive ? "Active now" : "Start conversation"}
                </p>
              </div>

              {/* Unread */}
              {count > 0 && (
                <span className="bg-[#6d5dfc] text-white text-[11px] font-semibold min-w-5 h-5 rounded-full flex items-center justify-center px-1.5 shadow-sm">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            No users found
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full border border-red-300 text-red-500 text-sm font-medium py-2.5 rounded-lg hover:bg-red-50 transition"
        >
          Sign out
        </button>
      </div>

    </aside>
  );
}