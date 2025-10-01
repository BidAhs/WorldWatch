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
    if (!cachedData.length || now - lastUpdated > 10 * 60 * 1000) {
      const response = await fetch("https://www.spc.noaa.gov/products/watch/wwa.xml");
      const text = await response.text();
      cachedData = [{ raw: text }]; // adjust if you want to parse XML
      lastUpdated = now;
      console.log("Tornado data refreshed");
    }

    res.status(200).json({ data: cachedData });
  } catch (err) {
    console.error("API error in tornadoes.js:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
