import fetch from "node-fetch";
import xml2js from "xml2js";

let cachedData = [];
let lastUpdated = 0;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const now = Date.now();
  if (!cachedData.length || now - lastUpdated > 5 * 60 * 1000) {
    try {
      const response = await fetch("https://volcano.si.edu/news/WeeklyVolcanoRSS.xml");
      const text = await response.text();
      const result = await xml2js.parseStringPromise(text);

      cachedData = result.rss.channel[0].item.map((item) => ({
        title: item.title[0],
        link: item.link[0],
        pubDate: item.pubDate[0],
      }));
      lastUpdated = now;
      console.log("Volcano data refreshed");
    } catch (err) {
      console.error("Failed to fetch volcano data", err.message);
    }
  }

  res.status(200).json({ data: cachedData });
}
