import { getAuth } from "firebase/auth";

const API_URL = "https://cost2go.onrender.com/api/history";

// Helper to get token
const getToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
};

export const saveSearch = async (data) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const fetchHistory = async () => {
  const token = await getToken();
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const deleteHistoryItem = async (id) => {
  const token = await getToken();
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
