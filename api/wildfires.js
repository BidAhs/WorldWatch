const axios = require("axios");

module.exports = async (req, res) => {
  try {
    const url = "https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires";
    const { data } = await axios.get(url);

    const result = data.events.flatMap((event) =>
      event.geometry.map((geo) => ({
        lat: Math.round(f.geo.coordinates[1] * 100) / 100,
        lon: Math.round(f.geo.coordinates[0] * 100) / 100,
        title: event.title,
        time: geo.date
      }))
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wildfires" });
  }
};
