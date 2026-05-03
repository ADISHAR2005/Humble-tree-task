const BASE_URL = "http://localhost:5000";

//  Login
export const loginUser = async (username) => {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  return res.json();
};

//  Get users
export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/api/users`);
  return res.json();
};

//  Get messages
export const getMessages = async (sender, receiver) => {
  const res = await fetch(
    `${BASE_URL}/api/messages/${sender}/${receiver}`
  );
  return res.json();
};

//  Send message
export const sendMessage = async (msgData) => {
  const res = await fetch(`${BASE_URL}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(msgData),
  });

  return res.json();
};