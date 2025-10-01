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
      const response = await fetch("https://volcano.si.edu/news/WeeklyVolcanoRSS.xml");
      const text = await response.text();
      const result = await xml2js.parseStringPromise(text);

      const items = result?.rss?.channel?.[0]?.item || [];
      cachedData = items.slice(0, 20).map(item => ({
        title: item.title?.[0] || "No title",
        link: item.link?.[0] || "",
        pubDate: item.pubDate?.[0] || "",
      }));
      lastUpdated = now;
      console.log("Volcano data refreshed");
    }

    res.status(200).json({ data: cachedData });
  } catch (err) {
    console.error("API error in volcanoes.js:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
