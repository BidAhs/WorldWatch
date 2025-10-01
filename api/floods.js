import fetch from "node-fetch";

let cachedData = [];
let lastUpdated = 0;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const now = Date.now();
    if (!cachedData.length || now - lastUpdated > 5 * 60 * 1000) {
      const response = await fetch("https://floods.globalfloods.eu/api");
      const data = await response.json();

      cachedData = (data.items || []).slice(0, 50).map(f => ({
        lat: f.latitude,
        lon: f.longitude,
        title: "Flood",
        info: f.description || "Active flood event",
      }));
      lastUpdated = now;
      console.log("Flood data refreshed");
    }

    res.status(200).json({ data: cachedData });
  } catch (err) {
    console.error("API error in floods.js:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
