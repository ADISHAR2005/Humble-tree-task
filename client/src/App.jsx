/* eslint-disable react-hooks/set-state-in-effect */
import { useState,useEffect } from "react";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <Chat user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;