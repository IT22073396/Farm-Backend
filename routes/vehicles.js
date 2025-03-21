const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { validateProduct, Product } = require('../models/Product');
const { validateVehicle, Vehicle } = require('../models/Vehicle');


//create vehicle


router.post("/", async(req,res) => {
    const { error } = validateVehicle(req.body);
    const { vehicle,model,status,last_inspection,next_inspection} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newVehicle = new Vehicle(req.body);
            const result = await newVehicle.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all vehicles

router.get("/", async(req,res) => {
    try {
        const vehicles = await Vehicle.find();
        return res.status(200).json({vehicles});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single vehicle by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const vehicle = await Vehicle.findById(id);

        if(!vehicle) {
            return res.status(404).json({error:"Vehicle not found"});
        }
        return res.status(200).json(vehicle);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a vehicle

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validateVehicle(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedVehicle){
            return res.status(404).json({error:"Vehicle not found"});

        }
        return res.status(200).json(updatedVehicle);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a vehicle

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deleteVehicle = await Vehicle.findByIdAndDelete(id);
        if(!deleteVehicle){
            return res.status(404).json({error:"Vehicle not found"});
        }
        return res.status(200).json({message:"Vehicle deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;

