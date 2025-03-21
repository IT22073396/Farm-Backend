const mongoose = require('mongoose');
const Joi = require('joi');

// Define mail schema
const mailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    createdAt: { type: Date, default: Date.now }
});

// Create model
const Mail = mongoose.model("Mail", mailSchema);

// Validation function
const validateMail = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
    });
    return schema.validate(data);
}

module.exports = {
    Mail,
    validateMail
};
