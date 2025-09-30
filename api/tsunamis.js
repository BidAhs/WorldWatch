import fetch from "node-fetch";
import xml2js from "xml2js";

let cachedData = [];
let lastUpdated = 0;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const now = Date.now();
  if (!cachedData.length || now - lastUpdated > 5 * 60 * 1000) {
    try {
      const response = await fetch("https://www.tsunami.gov/events/xml/PAAQCAP.xml");
      const text = await response.text();
      const result = await xml2js.parseStringPromise(text);

      cachedData = result.feed.entry.map(e => ({
        lat: parseFloat(e["georss:point"][0].split(" ")[0]),
        lon: parseFloat(e["georss:point"][0].split(" ")[1]),
        title: e.title[0],
        info: e.summary[0]
      }));
      lastUpdated = now;
      console.log("Tsunami data refreshed");
    } catch (err) {
      console.error("Failed to fetch tsunami data", err.message);
    }
  }

  res.status(200).json({ data: cachedData });
}
