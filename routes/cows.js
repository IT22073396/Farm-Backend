const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const { validateCow, Cow } = require("../models/Cow");


// Create or update cow
router.post("/", async (req, res) => {
    const { error } = validateCow(req.body);
    const { cow_id, tag_number, breed, date_of_birth, gender } = req.body;

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        let cowItem = await Cow.findOne({ cow_id, tag_number });

        if (cowItem) {
            // If cow item exists, update the quantity
            cowItem.quantity += parseInt(quantity); // Convert quantity to integer and then add
            await cowItem.save();
            return res.status(200).json(cowItem);
        } else {
            // If cow item doesn't exist, create a new one
            const newCow = new Cow({ cow_id, tag_number, breed, date_of_birth, gender, createdAt: Date.now() });
            const result = await newCow.save();
            return res.status(201).json(result);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

// Fetch all cow items
router.get("/", async (req, res) => {
    try {
        const cows = await Cow.find();
        return res.status(200).json({ cows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

// Update cow item
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
            return res.status(404).json({ error: "Cow not found" });
        }
        return res.status(200).json(updatedCow);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

// Delete cow item
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }

    try {
        const deleteCow = await Cow.findByIdAndDelete(id);
        if (!deleteCow) {
            return res.status(404).json({ error: "Cow not found" });
        }
        return res.status(200).json({ message: "Cow deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

// Fetch a single cow item by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "No id specified" });
    }
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }

    try {
        const cow = await Cow.findById(id);
        if (!cow) {
            return res.status(404).json({ error: "cow not found" });
        }
        return res.status(200).json(cow);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});
// Fetch all cowws
router.get("/:id", async (req, res) => {
    try {
        const cows = await Cow.find();
        const cowData = cows.map(item => ({
            
            cow_id: item.cow_id,
            tag_number: item.tag_number,
            breed: item.breed, 
            date_of_birth: item.date_of_birth,
            gender: item.gender,
            
            
        }));
        return res.status(200).json({ cows: cowData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;