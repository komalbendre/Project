import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get logged-in user's profile
export const getMyProfile = async () => {
  const response = await api.get("/profile/me");
  return response.data;
};

// Create / Update profile
export const saveProfile = async (payload) => {
  const response = await api.put("/profile/me", payload);
  return response.data;
};


