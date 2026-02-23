import axios from "axios";

// This reads the URL from .env
const API = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
