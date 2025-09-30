import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE;

export const fetchVolcanoes = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/volcanoes`);
    return Array.isArray(res.data.data) ? res.data.data : [];
  } catch (err) {
    console.error("Error fetching volcanoes:", err.message);
    return [];
  }
};
