const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');

//define deliverySchema

const deliverySchema = new mongoose.Schema({
     id:{
        type:String,
        optional:[true,"Delivery Id is required"],
    },
    name:{
        type:String,
        required:[true,"Name is required"],
    },
    address:{
        type:String,
        required:[true,"address is required"],
    },
    weight:{
        type:Number,
        required:[true,"Weight is required"],
    },
    courierName:{
        type:String,
        required:[true,"courier Name is required"],
    },
    status:{
        type:String,
        required:[true,"Status is required"],
    },
    email:{
        type:String,
        required:[true,"email is required"],
    },
    createdAt: { type: Date }
})

//create model

const Delivery = new mongoose.model("Delivery",deliverySchema);

const validateDelivery = data => {
    const schema = Joi.object({
        id:Joi.string().optional(),
        name:Joi.string().required(),
        address:Joi.string().required(),
        weight:Joi.number().required(),
        courierName:Joi.string().required(),
        status:Joi.string().required(),
        email:Joi.string().required(),
    
    })
    return schema.validate(data);
}

module.exports = {
    validateDelivery,
    Delivery,
}