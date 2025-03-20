// Require necessary modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Define cart item schema
const CartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

// Define cart schema
const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [CartItemSchema],
    createdAt: { type: Date }
});

// Create Cart model
const Cart = mongoose.model('Cart', CartSchema);

// Validate cart data
const validateCart = data => {
    const schema = Joi.object({
        userId: Joi.string().required(),
        items: Joi.array().items(Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required()
        })).required()
    });

    return schema.validate(data);
};

module.exports = {
    validateCart,
    Cart,
};
