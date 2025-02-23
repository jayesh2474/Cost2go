const API_URL = "https://cost2go.onrender.com/api/history";

export const saveSearch = async (data) => {
  const response = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const fetchHistory = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const deleteHistoryItem = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};
