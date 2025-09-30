import axios from "axios";

let cachedData = [];
let lastUpdated = 0;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const now = Date.now();
  if (!cachedData.length || now - lastUpdated > 5 * 60 * 1000) {
    try {
      const response = await axios.get(
        "https://opensky-network.org/api/states/all"
      );
      const states = response.data.states || [];
      cachedData = states
        .filter((s) => s[5] !== null && s[6] !== null)
        .slice(0, 75)
        .map((s) => ({
          callsign: s[1] || "Unknown",
          lat: s[6],
          lon: s[5],
          altitude: s[13],
        }));
      lastUpdated = now;
      console.log("Plane data refreshed");
    } catch (err) {
      console.error("Error fetching planes", err.message);
    }
  }

  res.status(200).json({ data: cachedData });
}
