const BASE_URL = "http://localhost:5000/api/fuel";

export async function fetchFuelPrice() {
  const response = await fetch(`${BASE_URL}/price`);
  const data = await response.json();
  return data.fuelPrice;
}

export async function saveSearch(searchData) {
  const response = await fetch(`${BASE_URL}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchData),
  });
  return response.json();
}

export async function fetchSearchHistory() {
  const response = await fetch(`${BASE_URL}/history`);
  const data = await response.json();
  return data;
}
