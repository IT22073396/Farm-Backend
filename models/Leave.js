const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');

//define leaveSchema

const leaveSchema = new mongoose.Schema({
     id:{
        type:String,
        required:[true,"Leave Id is required"],
    },
    name:{
        type:String,
        required:[true,"Name is required"],
    },
    email:{
        type:String,
        required:[true,"Email is required"],
    },
    leaveType:{
        type:String,
    required:[true,"Leave Type is required"],
    },
    leaveTypeDetails:{
        type:String,
        required:[true,"Leave type details is required"],
    },
    createdOn:{
        type:Date,
        required:[true,"Created on is required"],
    },
    leaveTypeStatus:{
        type:String,
        required:[true,"Leave typestatus is required"],
    },
    createdAt: { type: Date }
})

//create model

const Leave = new mongoose.model("Leave",leaveSchema);

const validateLeave = data => {
    const schema = Joi.object({
        id:Joi.string().required(),
        name:Joi.string().optional(),
        email:Joi.string().optional(),
        leaveType:Joi.string().required(),
        leaveTypeDetails:Joi.string().required(),
        createdOn:Joi.date().required(),
        leaveTypeStatus:Joi.string().required(),
    
    })
    return schema.validate(data);
}

module.exports = {
    validateLeave,
    Leave,
}