const express = require('express');
const router = express.Router();
const CustomerOrder = require('../models/CustomerOrder');

// Route to create a new customer order
router.post('/', async (req, res) => {
    try {
        const newOrder = new CustomerOrder({
            userId: req.body.userId, // Assuming you have the user ID available in the request body
            cart: req.body.cart,
            totalPrice: req.body.totalPrice
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the order' });
    }
});

// Route to fetch all customer orders
router.get('/', async (req, res) => {
    try {
        const customerOrders = await CustomerOrder.find();
        res.status(200).json(customerOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching customer orders' });
    }
});

// Route to fetch a customer order by ID
router.get('/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await CustomerOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the order' });
    }
});

// Route to delete a customer order by ID
router.delete('/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const deletedOrder = await CustomerOrder.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the order' });
    }
});

module.exports = router;
