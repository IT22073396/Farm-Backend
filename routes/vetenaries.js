const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const { validateCow, Cow } = require("../models/Vetenary");

// Create or update cow record
router.post("/", async (req, res) => {
    const { error } = validateCow(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        let cow = await Cow.findOne({ cow_id: req.body.cow_id });

        if (cow) {
            // If cow record exists, update it
            Object.assign(cow, req.body);
            await cow.save();
            return res.status(200).json(cow);
        } else {
            // If cow record doesn't exist, create a new one
            const newCow = new Cow(req.body);
            const result = await newCow.save();
            return res.status(201).json(result);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

// Fetch all cow records
router.get("/", async (req, res) => {
    try {
        const cows = await Cow.find();
        return res.status(200).json({ cows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

// Fetch a single cow record by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }

    try {
        const cow = await Cow.findById(id);
        if (!cow) {
            return res.status(404).json({ error: "Cow record not found" });
        }
        return res.status(200).json(cow);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

// Update cow record
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }

    const { error } = validateCow(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const updatedCow = await Cow.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCow) {
            return res.status(404).json({ error: "Cow record not found" });
        }
        return res.status(200).json(updatedCow);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

// Delete cow record
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }

    try {
        const deletedCow = await Cow.findByIdAndDelete(id);
        if (!deletedCow) {
            return res.status(404).json({ error: "Cow record not found" });
        }
        return res.status(200).json({ message: "Cow record deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;