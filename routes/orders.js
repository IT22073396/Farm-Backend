const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { Order, validateOrder } = require('../models/Orders');

//create orders


router.post("/", async(req,res) => {
    const { error } = validateOrder(req.body);
    const { id,name,orderid,productid,supplierid,quantity,sku} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newOrder = new Order(req.body);
            const result = await newOrder.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all orders

router.get("/", async(req,res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json({orders});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single order by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const order = await Order.findById(id);

        if(!order) {
            return res.status(404).json({error:"Order not found"});
        }
        return res.status(200).json(order);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a order

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validateOrder(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedOrder){
            return res.status(404).json({error:"Order not found"});

        }
        return res.status(200).json(updatedOrder);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a order

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deleteOrder = await Order.findByIdAndDelete(id);
        if(!deleteOrder){
            return res.status(404).json({error:"Order not found"});
        }
        return res.status(200).json({message:"Order deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;

