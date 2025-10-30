import axios from "axios";

const adminAxios = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔹 Automatically attach admin token
adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // admin token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ⚙️ Only set JSON header if it's not FormData
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default adminAxios;
