const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { validateDelivery, Delivery } = require('../models/Delivery');
const nodemailer = require('nodemailer');


//create delivery


router.post("/", async(req,res) => {
    const { error } = validateDelivery(req.body);
  
    const { name,address,weight,courierName,status,description} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newDelivery = new Delivery(req.body);
            const result = await newDelivery.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all deliveries

router.get("/", async(req,res) => {
    try {
        const deliveries = await Delivery.find();
        return res.status(200).json({deliveries});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single delivery by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const delivery = await Delivery.findById(id);

        if(!delivery) {
            return res.status(404).json({error:"Delivery not found"});
        }
        return res.status(200).json(delivery);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a delivery

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    const { status, email } = req.body; 

    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validateDelivery(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {

        const updatedDelivery = await Delivery.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedDelivery){
            return res.status(404).json({error:"Delivery not found"});

        }
        const transporter = nodemailer.createTransport({
            service: 'hotmail', // Use your email service provider, e.g., Gmail
            auth: {
              user: 'amadhiyapaa@hotmail.com', // Your email address
              pass: 'AmaTheToad2003' // Your email password or app-specific password
            }
          });

        if (status === "Delivered") {
            // Send email notification using the configured transporter
            await transporter.sendMail({
              from: 'amadhiyapaa@hotmail.com',
              to: email, // Email address retrieved from the request body
              subject: 'Delivery Status Update',
              text: `Your delivery (ID: ${id}) has been delivered.`,
            });
          }
      

        return res.status(200).json(updatedDelivery);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a delivery

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deleteDelivery = await Delivery.findByIdAndDelete(id);
        if(!deleteDelivery){
            return res.status(404).json({error:"Delivery not found"});
        }
        return res.status(200).json({message:"Delivery deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;

