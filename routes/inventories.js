const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const { validateInventory, Inventory } = require("../models/Inventory");


// Create or update inventory item
router.post("/", async (req, res) => {
    const { error } = validateInventory(req.body);
    const { productname, sku, quantity, unitprice, itemno, suppliername } = req.body;

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        let inventoryItem = await Inventory.findOne({ productname, sku });

        if (inventoryItem) {
            // If inventory item exists, update the quantity
            inventoryItem.quantity += parseInt(quantity); // Convert quantity to integer and then add
            await inventoryItem.save();
            return res.status(200).json(inventoryItem);
        } else {
            // If inventory item doesn't exist, create a new one
            const newInventory = new Inventory({ productname, sku, quantity, unitprice, itemno, suppliername, createdAt: Date.now() });
            const result = await newInventory.save();
            return res.status(201).json(result);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

// Fetch all inventory items
router.get("/", async (req, res) => {
    try {
        const inventories = await Inventory.find();
        return res.status(200).json({ inventories });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

// Update inventory item
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }

    const { error } = validateInventory(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const updatedInventory = await Inventory.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedInventory) {
            return res.status(404).json({ error: "Inventory not found" });
        }
        return res.status(200).json(updatedInventory);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

// Delete inventory item
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }

    try {
        const deleteInventory = await Inventory.findByIdAndDelete(id);
        if (!deleteInventory) {
            return res.status(404).json({ error: "Inventory not found" });
        }
        return res.status(200).json({ message: "Inventory deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

// Fetch a single inventory item by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "No id specified" });
    }
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }

    try {
        const inventory = await Inventory.findById(id);
        if (!inventory) {
            return res.status(404).json({ error: "Inventory not found" });
        }
        return res.status(200).json(inventory);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});
// Fetch all inventory items with product quantities
router.get("/:id", async (req, res) => {
    try {
        const inventories = await Inventory.find();
        const inventoryData = inventories.map(item => ({
            
            productname: item.productname,
            sku: item.sku,
            quantity: item.quantity, // Include quantity
            unitprice: item.unitprice,
            itemno: item.itemno,
            suppliername: item.suppliername,
            
        }));
        return res.status(200).json({ inventories: inventoryData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;