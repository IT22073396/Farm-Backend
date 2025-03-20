//reqquire mongoose package
const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants')
//define userscheama
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required."],
    },
    password:{
        type:String,
        required:[true,"Password is required."],
    },
    userRole:{
        type:String,
        required:[true,"userRole is required"]
    },
    name:{
        type:String,
        required:[true,"Name is required."],
    },
    phone:{
        type:Number,
        required:[true,"Phone number is required."]
    },
    address:{
        type:String,
        required:[true,"address is required."]
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    createdAt: { type: Date }
});

//create model

const User = new mongoose.model("User",UserSchema);

const validateEmployee = data => {

    const schema = Joi.object({
        email:Joi.string().email().required(),
        userRole: Joi.string().valid(...Object.keys(USER_TYPES)).required() ,
        name:Joi.string().required(),
        phone:Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        address:Joi.string().required(),
    });

    return schema.validate(data);
}

module.exports = {
    validateEmployee,
    User,
};



