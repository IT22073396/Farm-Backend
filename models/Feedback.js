const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');

//define feedbackSchema

const feedbackSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:[true,"productName is required"],
    },
    overallExperience:{
        type:String,
        required:[true,"overallExperience is required"],
    },
    quality:{
        type:String,
    required:[true,"quality is required"],
    },
    likelihoodToReccomend:{
        type:String,
        required:[true,"likelihoodToReccomend is required"],
    },
    improvedSuggestions:{
        type:String,
        required:[true,"improvedSuggestions is required"],
    },
    
    createdAt: { type: Date }
})

//create model

const Feedback = new mongoose.model("Feedback",feedbackSchema);

const validateFeedback = data => {
    const schema = Joi.object({
        productName:Joi.string().required(),
        overallExperience:Joi.string().optional(),
        quality:Joi.string().optional(),
        likelihoodToReccomend:Joi.string().required(),
        improvedSuggestions:Joi.string().required(),
        
    
    })
    return schema.validate(data);
}

module.exports = {
    validateFeedback,
    Feedback,
}