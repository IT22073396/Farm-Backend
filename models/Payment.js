const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');


//define payslipSchema

const paymentSchema = new mongoose.Schema({
    cart:{
        type:Array,
        required:[true,"cart is required"],
    },
    name:{

        type:String,
        required:[true,"Card Holder Name is required"],
    },
    number:{

        type:Number,
        required:[true,"Card Number is required"],
    },
    expiryDate:{
        type:Date,
        required:[true,"Expiry Date is required"],
    },
    cvv:{
        type:Number,
        required:[true,"CVV is required"],
    },
    issuingBank:{
        type:String,
        required:[true,"Issuing Bank is required"],
    },
    createdAt: { type: Date }
});

//create model

const Payment = new mongoose.model("Payment",paymentSchema);

const validatePayment = data => {

    const schema = Joi.object({
        userId: Joi.string().optional(),
        cart:Joi.array().optional(),
        name:Joi.string().required(),
        number:Joi.number().required(),
        expiryDate:Joi.date().required(),
        cvv:Joi.number().required(),
        issuingBank:Joi.string().required(),
        totalPrice:Joi.number().optional(),
    })
    return schema.validate(data);

}

module.exports = {
    validatePayment,
    Payment,
}
