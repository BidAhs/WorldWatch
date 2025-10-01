export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    message: "WorldWatch API is running",
    endpoints: [
      "/api/earthquakes",
      "/api/volcanoes",
      "/api/floods",
      "/api/tsunamis",
      "/api/hurricanes",
      "/api/wildfires",
      "/api/planes",
      "/api/tornadoes",
    ],
  });
}