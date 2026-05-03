import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function Chat({ user, onLogout }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [unread, setUnread] = useState({});

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setUnread((prev) => ({ ...prev, [u._id]: 0 }));
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#0f0f11]">
      <Sidebar
        user={user}
        onLogout={onLogout}
        onSelectUser={handleSelectUser}
        unread={unread}
        selectedUser={selectedUser}
      />
      <ChatWindow
        user={user}
        selectedUser={selectedUser}
        setUnread={setUnread}
      />
    </div>
  );
}