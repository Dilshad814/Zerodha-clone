import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "" });

export const getErrorMessage = (error) =>
  error.response?.data?.message || "Server se connect nahi ho paya. Backend chalu karke dobara try karein.";

export default api;
