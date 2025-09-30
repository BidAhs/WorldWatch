import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await fetch("https://volcano.si.edu/news/WeeklyVolcanoRSS.xml");
    const text = await response.text();


  } catch (err) {
    res.status(500).json({ error: "Failed to fetch volcano data" });
  }
});

export default router;
