const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');


//define payslipSchema

const supplierSchema = new mongoose.Schema({
    id:{
        type:String,
        optional:[true,"Id is required"],
    },
    name:{

        type:String,
        required:[true,"Name is required"],
    },
    email:{
        type:String,
        required:[true,"Email is required"],
    },
    registeredDate:{
        type:Date,
        required:[true,"Reg date is required"],
    },
    location:{
        type:String,
        required:[true,"Location is required"],
    },
    createdAt: { type: Date }
});

//create model

const Supplier = new mongoose.model("Supplier",supplierSchema);

const validateSupplier = data => {

    const schema = Joi.object({
        id:Joi.string().optional(),
        name:Joi.string().required(),
       email:Joi.string().required(),
       registeredDate:Joi.date().required(),
        location:Joi.string().required(),
    })
    return schema.validate(data);

}

module.exports = {
    validateSupplier,
    Supplier,
}
