import axios from "axios";
import { parse } from "csv-parse/sync";

let cachedData = [];
let lastUpdated = 0;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const now = Date.now();
  if (!cachedData.length || now - lastUpdated > 5 * 60 * 1000) {
    try {
      const today = new Date();
      const urls = [];
      for (let i = 0; i < 2; i++) { // last 2 days only
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        urls.push(`https://www.spc.noaa.gov/climo/reports/${y}${m}${day}_rpts_torn.csv`);
      }

      let allRecords = [];
      for (const url of urls) {
        try {
          const { data } = await axios.get(url);
          const records = parse(data, { columns: true, skip_empty_lines: true });
          allRecords = allRecords.concat(
            records.map(r => ({
              lat: parseFloat(r.LAT),
              lon: parseFloat(r.LON),
              location: r.LOCATION || "Unknown",
              time: r.TIME || "N/A",
            }))
          );
        } catch {}
      }

      cachedData = allRecords.slice(0, 50); // max 50 tornadoes
      lastUpdated = now;
      console.log("Tornado data refreshed");
    } catch (err) {
      console.error("Failed to refresh tornado data", err.message);
    }
  }

  res.status(200).json({ data: cachedData });
}
