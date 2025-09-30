import axios from "axios";

let cachedData = [];
let lastUpdated = 0;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const now = Date.now();
  if (!cachedData.length || now - lastUpdated > 5 * 60 * 1000) {
    try {
      const url = "https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires";
      const { data } = await axios.get(url);
      cachedData = data.events
        .flatMap((event) =>
          event.geometry.map((geo) => ({
            lat: geo.coordinates[1],
            lon: geo.coordinates[0],
            title: event.title,
          }))
        )
        .slice(50, 210);
      lastUpdated = now;
      console.log("Wildfire data refreshed");
    } catch (err) {
      console.error("Failed to refresh wildfire data", err.message);
    }
  }

  res.status(200).json({ data: cachedData });
}
