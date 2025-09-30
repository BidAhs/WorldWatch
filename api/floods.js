import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await fetch("https://floods.globalfloods.eu/api");
    const data = await response.json();

    const floods = data.items.map(f => ({
      lat: f.latitude,
      lon: f.longitude,
      title: "Flood",
      info: f.description || "Active flood event"
    }));

    res.json(floods);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flood data" });
  }
});

export default router;
