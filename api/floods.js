import fetch from "node-fetch";

let cachedData = [];
let lastUpdated = 0;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const now = Date.now();
  if (!cachedData.length || now - lastUpdated > 5 * 60 * 1000) {
    try {
      const response = await fetch("https://floods.globalfloods.eu/api");
      const data = await response.json();

      cachedData = data.items.map(f => ({
        lat: f.latitude,
        lon: f.longitude,
        title: "Flood",
        info: f.description || "Active flood event"
      }));
      lastUpdated = now;
      console.log("Flood data refreshed");
    } catch (err) {
      console.error("Failed to fetch flood data", err.message);
    }
  }

  res.status(200).json({ data: cachedData });
}
