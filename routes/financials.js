const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { validateFinancial, Financial } = require('../models/Financial');

//create 


router.post("/", async(req,res) => {
    const { error } = validateFinancial(req.body);
    const { id,dduration,tsale,tcost,cofPsales} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newFinancial = new Financial(req.body);
            const result = await newFinancial.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all financials

router.get("/", async(req,res) => {
    try {
        const financials = await Financial.find();
        return res.status(200).json({financials});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single financial by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const financial = await Financial.findById(id);

        if(!financial) {
            return res.status(404).json({error:"Finacial Report not found"});
        }
        return res.status(200).json(financial);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a financial

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validateFinancial(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedFinancial = await Financial.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedFinancial){
            return res.status(404).json({error:"Financial report not found"});

        }
        return res.status(200).json(updatedFinancial);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a financial

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deleteFinancial = await Financial.findByIdAndDelete(id);
        if(!deleteFinancial){
            return res.status(404).json({error:"Financial Report not found"});
        }
        return res.status(200).json({message:"Financial Report deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;