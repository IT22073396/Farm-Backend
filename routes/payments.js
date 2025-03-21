const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { validatePayment, Payment } = require('../models/Payment');
const { Cart } = require('../models/Cart');
const { Product } = require('../models/Product'); // Import Product model
const CustomerOrder = require('../models/CustomerOrder'); // Import Product model

// Create payment
router.post("/", async (req, res) => {
    try {
        const { userId, cart, totalPrice } = req.body;
        if (!userId || !cart || !totalPrice) {
            return res.status(400).json({ error: "userId, cart, and totalPrice are required fields" });
        }

        // Convert product IDs to ObjectId
        const newOrder = new CustomerOrder({
            userId: req.body.userId,
            cart: req.body.cart.map(item => ({ 
                productId: item.productId, 
                quantity: item.quantity,
                name:item.name,
                price:item.price

            })),
            totalPrice: req.body.totalPrice
        });

        const { error } = validatePayment(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const newPayment = new Payment(req.body);
        const paymentResult = await newPayment.save();

        // Deduct product quantities after successful payment
        await deductProductQuantities(cart); // Call the function to deduct quantities

        // Save the customer order to the customer order database
        const orderResult = await newOrder.save();

        // Return both payment and order details in the response
        return res.status(201).json({ payment: paymentResult, order: orderResult });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

// Function to deduct product quantities after successful payment
async function deductProductQuantities(cart) {
    try {
        console.log('Cart:', cart); // Log the cart object to debug
        // Check if cart is iterable
        if (!Array.isArray(cart)) {
            throw new Error('Cart is not iterable');
        }
        
        // Deduct the quantity of each product in the cart from the total available quantity
        for (const cartItem of cart) { // Iterate over each item in the cart
            const productId = cartItem.productId;
            const quantityInCart = cartItem.quantity;

            // Fetch the product from the database
            const product = await Product.findOne({ productId: productId });
            if (!product) {
                console.error(`Product with ID ${productId} not found`);
                continue; // Move to the next item in the cart
            }

            // Deduct the quantity from the total available quantity
            product.quantity -= quantityInCart;

            // Save the updated product back to the database
            await product.save();
        }

        console.log('Product quantities deducted successfully');
    } catch (error) {
        console.error('Error deducting product quantities after payment:', error);
    }
}

// Get all payments
router.get("/", async (req, res) => {
    try {
        const payments = await Payment.find();
        return res.status(200).json({ payments });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
});

// Get a single payment by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "no id specified." });
    }
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }

    try {
        const payment = await Payment.findById(id);

        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        return res.status(200).json(payment);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err.message });
    }
});

// Update a payment
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }
    const { error } = validatePayment(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPayment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        return res.status(200).json(updatedPayment);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

// Delete a payment
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Please enter a valid id" });
    }
    try {
        const deletePayment = await Payment.findByIdAndDelete(id);
        if (!deletePayment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        return res.status(200).json({ message: "Payment deleted Successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
