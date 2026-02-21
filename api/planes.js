const axios = require("axios");

module.exports = async (req, res) => {
  try {
    // Use ADSB.lol free API - no auth, global live aircraft
    const response = await axios.get("https://api.adsb.lol/v2/ladd", {
      timeout: 30000,
    });

    // Response: { ac: [ ... ] }
    const aircraft = response.data.ac || [];

    const planes = aircraft
      .filter((p) => p.lat != null && p.lon != null) // Ensure lat/lon present
      .slice(0, 75)
      .map((p) => ({
        callsign: (p.flight || p.callsign || "Unknown").trim(),
        lat: p.lat,
        lon: p.lon,
        altitude: p.alt_baro ?? p.alt_geom ?? "N/A", // Use baro altitude, fallback to geometric or N/A
      }));

    res.json(planes);
  } catch (err) {
    console.error("Error fetching planes from ADSB.lol", {
      message: err.message,
      code: err.code,
      status: err.response?.status,
      data: err.response?.data,
    });
    res.status(500).json({ error: "Failed to fetch planes" });
  }
};
