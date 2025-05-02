const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');

// Define cow schema
const CowSchema = new mongoose.Schema({
    cow_id: {
        type: String,
        unique: true,
        required: [true, "Cow ID is required."]
    },
    tag_number: {
        type: String,
        required: [true, "Tag number is required."]
    },
    breed: {
        type: String,
        required: [true, "Breed is required."]
    },
    date_of_birth: {
        type: Date,
        required: [true, "Date of birth is required."]
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: [true, "Gender is required."]
    },
    createdAt: { type: Date }
});

// Create Cow model
const Cow =  mongoose.model("Cow", CowSchema);

// Validate cow data
const validateCow = data => {
    const schema = Joi.object({
        cow_id: Joi.string().required(),
        tag_number: Joi.string().required(),
        breed: Joi.string().required(),
        date_of_birth: Joi.date().required(),
        gender: Joi.string().valid('Male', 'Female').required()
    });

    return schema.validate(data);
};

module.exports = {
    validateCow,
    Cow,
};