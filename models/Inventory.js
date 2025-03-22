const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');


// Define inventory schema
const InventorySchema = new mongoose.Schema({
    productname: {
        type: String,
        required: [true, "Product name is required."]
    },
    sku: {
        type: String,
        required: [true, "SKU is required."]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required."],
        
    },
    unitprice: {
        type: Number,
        required: [true, "Unit Price is required."]
    },
    itemno: {
        type: Number,
        required: [true, "Item Number is required."]
    },
    suppliername: {
        type: String,
        required: [true, "Supplier Name is required."]
    },
        createdAt: { type: Date }
    

});

// Create Inventory model
const Inventory = mongoose.model("Inventory", InventorySchema);

// Validate inventory data
const validateInventory = data => {
    const schema = Joi.object({
        productname: Joi.string().required(),
        sku: Joi.string().required(),
        quantity: Joi.number().integer().min(0).required(),
        unitprice: Joi.number().positive().required(),
        itemno: Joi.number().integer().min(0).required(),
        suppliername: Joi.string().required()
        
    });

    return schema.validate(data);
};

module.exports = {
    validateInventory,
    Inventory,
};