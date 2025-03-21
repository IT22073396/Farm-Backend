const router = require('express').Router();
const { Cart, validateCart } = require('../models/Cart');
const { User } = require('../models/User');
const { Product } = require('../models/Product');
const mongoose = require('mongoose');

router.post('/initialize', async (req, res) => {
    try {
        const { userId } = req.body;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Define default items for the cart
        const defaultItems = [
            { productId: 'product_id_1', quantity: 1 },
            { productId: 'product_id_2', quantity: 2 },
            // Add more default items as needed
        ];

        // Create or update cart with default items
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: defaultItems });
        } else {
            // Merge default items with existing items
            cart.items = [...cart.items, ...defaultItems];
        }

        await cart.save();

        return res.status(201).json(cart);
    } catch (error) {
        console.error('Error initializing cart:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add item to cart
router.post('/', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        // Validate cart data
        const { error } = validateCart(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Create cart item
        const cartItem = {
            productId,
            quantity
        };

        // Create or update cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [cartItem] });
        } else {
            const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
            if (existingItemIndex !== -1) {
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                cart.items.push(cartItem);
            }
        }

        await cart.save();

        return res.status(201).json(cart);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get user's cart
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Find user's cart
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching user cart:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update item quantity in cart
router.put('/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        // Validate cart data
        const { error } = validateCart(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Find user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find cart item and update quantity
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;

        // Save updated cart
        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Remove item from cart
router.delete('/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        // Find user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Remove item from cart
        cart.items = cart.items.filter(item => item.productId !== productId);

        // Save updated cart
        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
