const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');


//define shipmentSchema

const shipmentSchema = new mongoose.Schema({
    route:{
        type:String,
        optional:[true,"Route is required"],
    },
    supplier:{
        type:String,
        required:[true,"Supplier is required"],
    },
    date:{
        type:Date,
        required:[true,"Date is required"],
    },
    vehicle:{
        type:String,
        required:[true,"Vehicle is required"],
    },
    max_distance:{
        type:String,
        required:[true,"Distance is required"],
    },
    speed_limit:{
        type:String,
        required:[true,"Speed is required"],
    },
    arrival:{
        type:Date,
        required:[true,"Date is required"],
    },
    driver:{
        type:String,
        required:[true,"Driver is required"],
    },
    note:{
        type:String,
        required:[true,"Distance is required"],
    },

    createdAt: { type: Date }
});

//create model

const Shipment = new mongoose.model("Shipment",shipmentSchema);

const validateShipment = data => {

    const schema = Joi.object({
        route:Joi.string().required(),
        supplier:Joi.string().required(),
        date:Joi.date().required(),
        vehicle:Joi.string().required(),
        max_distance:Joi.string().required(),
        speed_limit:Joi.string().required(),
        arrival:Joi.date().required(),
        driver:Joi.string().required(),
        note:Joi.string().required(),
    })
    return schema.validate(data);

}

module.exports = {
    validateShipment,
    Shipment,
}
