const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { validateProduct, Product } = require('../models/Product');
const { validateShipment, Shipment } = require('../models/Shipment');


//create shipment


router.post("/", async(req,res) => {
    const { error } = validateShipment(req.body);
    const {  route,
        supplier,
        date,
        vehicle,
        max_distance,
        speed_limit,
        arrival,
        driver,
        note} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newShipment = new Shipment(req.body);
            const result = await newShipment.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all shipments

router.get("/", async(req,res) => {
    try {
        const shipments = await Shipment.find();
        return res.status(200).json({shipments});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single shipments by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const shipment = await Shipment.findById(id);

        if(!shipment) {
            return res.status(404).json({error:"shipment not found"});
        }
        return res.status(200).json(shipment);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a shipment

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validateShipment(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedShipment = await Shipment.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedShipment){
            return res.status(404).json({error:"shipment not found"});

        }
        return res.status(200).json(updatedShipment);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a shipment

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deleteShipment = await Shipment.findByIdAndDelete(id);
        if(!deleteShipment){
            return res.status(404).json({error:"Shipment not found"});
        }
        return res.status(200).json({message:"Shipment deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;

