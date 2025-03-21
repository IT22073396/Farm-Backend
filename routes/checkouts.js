const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { validateCheckout, Checkout } = require('../models/Checkout');


//create checkout


router.post("/", async(req,res) => {
    const { error } = validateCheckout(req.body);
  
    const { name,address,city,country,zip,phone,email} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newCheckout = new Checkout(req.body);
            const result = await newCheckout.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all checkout

router.get("/", async(req,res) => {
    try {
        const checkouts = await Checkout.find();
        return res.status(200).json({checkouts});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single checkout by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const checkout = await Checkout.findById(id);

        if(!checkout) {
            return res.status(404).json({error:"Checkout not found"});
        }
        return res.status(200).json(delivery);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a Checkout

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validateCheckout(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedCheckout = await Checkout.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedCheckout){
            return res.status(404).json({error:"Checkout not found"});

        }
        return res.status(200).json(updatedCheckout);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a checkout

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deleteCheckout = await Checkout.findByIdAndDelete(id);
        if(!deleteCheckout){
            return res.status(404).json({error:"Checkout not found"});
        }
        return res.status(200).json({message:"Checkout deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;

