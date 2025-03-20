const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');

//define checkoutSchema

const checkoutSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
    },
    address:{
        type:String,
        required:[true,"address is required"],
    },
    city:{
        type:String,
        required:[true,"City is required"],
    },
    country:{
        type:String,
        required:[true,"Country is required"],
    },
    zip:{
        type:Number,
        required:[true,"ZIP is required"],
    },
    phone:{
        type:Number,
        required:[true,"Phone is required"],
    },
    email:{
        type:String,
        required:[true,"Email is required"],
    },
    createdAt: { type: Date }
})

//create model

const Checkout = new mongoose.model("Checkout",checkoutSchema);

const validateCheckout = data => {
    const schema = Joi.object({
        name:Joi.string().required(),
        address:Joi.string().required(),
        city:Joi.string().required(),
        country:Joi.string().required(),
        zip:Joi.number().required(),
        phone:Joi.number().required(),
        email:Joi.string().required(),
    
    })
    return schema.validate(data);
}

module.exports = {
    validateCheckout,
    Checkout,
}