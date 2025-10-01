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
    if (!cachedData.length || now - lastUpdated > 2 * 60 * 1000) {
      const response = await fetch("https://opensky-network.org/api/states/all");
      const data = await response.json();
      cachedData = (data.states || []).slice(0, 100).map(s => ({
        icao24: s[0],
        callsign: s[1],
        country: s[2],
        lat: s[6],
        lon: s[5],
        baro_altitude: s[7],
      }));
      lastUpdated = now;
      console.log("Plane data refreshed");
    }

    res.status(200).json({ data: cachedData });
  } catch (err) {
    console.error("API error in planes.js:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
