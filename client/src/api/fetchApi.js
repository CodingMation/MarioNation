import axios from "axios";
const IP = window.location.hostname;

const fetchApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  // baseURL: `http://${IP}:5000/api`,
});
// export const materiallink = `http://${IP}:5000/u/materials`
// export const materiallink = `${import.meta.env.VITE_MATERIALS}`

  //   baseURL: `${import.meta.env.VITE_API_URL}/api`,
export default fetchApi;