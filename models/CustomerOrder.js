const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');

const CustomerOrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    cart: [{
        productId: {
            type: String,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        name:{
            type:String,
            required:true,
        },
        price:{
            type: Number,
            required: true
        },
        
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CustomerOrder = mongoose.model('CustomerOrder', CustomerOrderSchema);

module.exports = CustomerOrder;
