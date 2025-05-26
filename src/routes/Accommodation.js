const express = require("express");
const Accommodation = require("../models/Accommodation");
const router = express.Router();

// GET all accommodations
router.get("/", async (req, res) => {
  try {
    const accommodations = await Accommodation.findAll();
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new accommodation
router.post("/", async (req, res) => {
  try {
    const accommodation = await Accommodation.create(req.body);
    res.status(201).json(accommodation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET accommodation by ID
router.get("/:id", async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ error: "Accommodation not found" });
    }
    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 