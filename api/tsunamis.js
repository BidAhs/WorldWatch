import express from "express";
import fetch from "node-fetch";
import xml2js from "xml2js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await fetch("https://www.tsunami.gov/events/xml/PAAQCAP.xml");
    const text = await response.text();

    const result = await xml2js.parseStringPromise(text);
    const events = result.feed.entry.map(e => ({
      lat: parseFloat(e["georss:point"][0].split(" ")[0]),
      lon: parseFloat(e["georss:point"][0].split(" ")[1]),
      title: e.title[0],
      info: e.summary[0]
    }));

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tsunami data" });
  }
});

export default router;
