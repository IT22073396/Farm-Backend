const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { Supplier, validateSupplier } = require('../models/Suppliers');

//create suppliers


router.post("/", async(req,res) => {
    const { error } = validateSupplier(req.body);
    const { id,name,email,registeredDate,location} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newSupplier = new Supplier(req.body);
            const result = await newSupplier.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all suppliers

router.get("/", async(req,res) => {
    try {
        const suppliers = await Supplier.find();
        return res.status(200).json({suppliers});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single supplier by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const supplier = await Supplier.findById(id);

        if(!supplier) {
            return res.status(404).json({error:"Supplier not found"});
        }
        return res.status(200).json(supplier);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a supplier

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validateSupplier(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedSupplier){
            return res.status(404).json({error:"Supplier not found"});

        }
        return res.status(200).json(updatedSupplier);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a supplier

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deleteSupplier = await Supplier.findByIdAndDelete(id);
        if(!deleteSupplier){
            return res.status(404).json({error:"Supplier not found"});
        }
        return res.status(200).json({message:"Supplier deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;

