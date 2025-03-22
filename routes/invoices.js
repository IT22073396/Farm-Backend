const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { validateInvoice, Invoice } = require('../models/Invoice');

//create invoice


router.post("/", async(req,res) => {
    const { error } = validateInvoice(req.body);
    const { id,cname,orderid,orderedDate,tamount} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newInvoice = new Invoice(req.body);
            const result = await newInvoice.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all invoice

router.get("/", async(req,res) => {
    try {
        const invoices = await Invoice.find();
        return res.status(200).json({invoices});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single invoice by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const invoice = await Invoice.findById(id);

        if(!invoice) {
            return res.status(404).json({error:"Invoice not found"});
        }
        return res.status(200).json(invoice);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a invoice

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validateInvoice(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedInvoice){
            return res.status(404).json({error:"Invoice not found"});

        }
        return res.status(200).json(updatedInvoice);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a invoice

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deleteInvoice = await Invoice.findByIdAndDelete(id);
        if(!deleteInvoice){
            return res.status(404).json({error:"Invoice not found"});
        }
        return res.status(200).json({message:"Invoice deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;