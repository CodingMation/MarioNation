import axios from "axios";
const IP = window.location.hostname;

const LogRegApi = axios.create({
  // baseURL: `${import.meta.env.VITE_API_URL}/api`,
  baseURL: `http://${IP}:5000/api`,
});
export default LogRegApi;