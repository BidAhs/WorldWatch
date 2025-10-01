import fetch from "node-fetch";
import xml2js from "xml2js";

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
      const response = await fetch("https://www.tsunami.gov/events/xml/PAAQCAP.xml");
      const text = await response.text();
      const result = await xml2js.parseStringPromise(text);

      const events = result?.feed?.entry || [];
      cachedData = events.slice(0, 20).map(e => {
        let lat = null, lon = null;
        if (e["georss:point"]) {
          const [latStr, lonStr] = e["georss:point"][0].split(" ");
          lat = parseFloat(latStr);
          lon = parseFloat(lonStr);
        }
        return {
          lat,
          lon,
          title: e.title?.[0] || "No title",
          info: e.summary?.[0] || "No info",
        };
      });
      lastUpdated = now;
      console.log("Tsunami data refreshed");
    }

    res.status(200).json({ data: cachedData });
  } catch (err) {
    console.error("API error in tsunamis.js:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
