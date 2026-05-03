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
    <div className="h-screen flex bg-gray-100 text-gray-900">

      {/* Sidebar */}
      <Sidebar
        user={user}
        onLogout={onLogout}
        onSelectUser={handleSelectUser}
        unread={unread}
        selectedUser={selectedUser}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">

        {/* Empty State */}
        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-xs">
              
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                💬
              </div>

              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Select a chat
              </h2>

              <p className="text-sm text-gray-500">
                Choose a conversation from the sidebar to start messaging
              </p>

            </div>
          </div>
        ) : (
          <ChatWindow
            user={user}
            selectedUser={selectedUser}
            setUnread={setUnread}
          />
        )}
      </main>
    </div>
  );
}