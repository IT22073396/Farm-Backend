const router = require('express').Router();
const mongoose = require('mongoose');
const { validateMail, Mail } = require('../models/Mail');

// Create mail
router.post("/", async (req, res) => {
    const { error } = validateMail(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const newMail = new Mail(req.body);
        const result = await newMail.save();
        return res.status(201).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

// Get all mails
router.get("/", async (req, res) => {
    try {
        const mails = await Mail.find();
        return res.status(200).json({ mails });
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
        const mail = await Mail.findById(id);
        if (!mail) {
            return res.status(404).json({ error: "Mail not found" });
        }
        return res.status(200).json(mail);
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
        const deleteMail = await Mail.findByIdAndDelete(id);
        if (!deleteMail) {
            return res.status(404).json({ error: "Mail not found" });
        }
        return res.status(200).json({ message: "Mail deleted Successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
