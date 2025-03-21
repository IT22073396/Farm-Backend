const mongoose = require('mongoose');
const Joi = require('joi');

// Define tMailSchema
const tMailSchema = new mongoose.Schema({
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
const TMail = mongoose.model("TMail",tMailSchema);

// Validation function
const validateTMail = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
    });
    return schema.validate(data);
}

module.exports = {
    TMail,
    validateTMail
};
