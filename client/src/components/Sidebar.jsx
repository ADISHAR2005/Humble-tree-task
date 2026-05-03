import { useEffect, useState } from "react";
import { getUsers } from "../services/api";

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

const getColor = (name = "") => {
  if (!name) return AVATAR_COLORS[0];
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
};

export default function Sidebar({
  user,
  onLogout,
  onSelectUser,
  unread = {},
  selectedUser,
}) {
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
    <aside className="w-68 min-w-68 bg-[#fafafa] flex flex-col border-r">

      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-semibold text-purple-600">
          {getInitials(user.username)}
        </div>
        <span className="text-sm font-semibold">{user.username}</span>
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm outline-none"
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
              className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer
              ${isActive ? "bg-purple-100" : "hover:bg-gray-200"}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color.bg} ${color.text}`}>
                {getInitials(u.username)}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">{u.username}</p>
              </div>

              {count > 0 && (
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-3 border-t">
        <button
          onClick={onLogout}
          className="w-full border border-red-300 text-red-500 py-2 rounded-lg hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}