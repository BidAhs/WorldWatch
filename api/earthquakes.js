import axios from "axios";

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
      const url =
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
      const { data } = await axios.get(url);
      cachedData = data.features.map(f => ({
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
        mag: f.properties.mag,
      }));
      lastUpdated = now;
      console.log("Earthquake data refreshed");
    }

    res.status(200).json({ data: cachedData });
  } catch (err) {
    console.error("API error in earthquakes.js:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
