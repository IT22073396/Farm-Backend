const router = require('express').Router();
const mongoose = require('mongoose');
const { validateTMail, TMail } = require('../models/TMail');

// Create mail
router.post("/", async (req, res) => {
    const { error } = validateTMail(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const newTMail = new TMail(req.body);
        const result = await newTMail.save();
        return res.status(201).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

// Get all mails
router.get("/", async (req, res) => {
    try {
        const tmails = await TMail.find();
        return res.status(200).json({ tmails });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
});

// Get a single mail by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }
    try {
        const tmail = await TMail.findById(id);
        if (!tmail) {
            return res.status(404).json({ error: "Mail not found" });
        }
        return res.status(200).json(tmail);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
});

// Delete a mail
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }
    try {
        const deleteTMail = await TMail.findByIdAndDelete(id);
        if (!deleteTMail) {
            return res.status(404).json({ error: "Mail not found" });
        }
        return res.status(200).json({ message: "Mail deleted Successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
