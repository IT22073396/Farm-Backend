const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { USER_TYPES } = require("../constants");
const { validateFeedback, Feedback } = require('../models/Feedback');


//create feedback


router.post("/", async(req,res) => {
    const { error } = validateFeedback(req.body);
  
    const { productName,
        overallExperience,
        quality,
        likelihoodToReccomend,
        improvedSuggestions} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newFeedback = new Feedback(req.body);
            const result = await newFeedback.save();
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all feedbacks

router.get("/", async(req,res) => {
    try {
        const feedbacks = await Feedback.find();
        return res.status(200).json({feedbacks});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single feedbacks by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const feedback = await Feedback.findById(id);

        if(!feedback) {
            return res.status(404).json({error:"feedback not found"});
        }
        return res.status(200).json(feedback);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a feedback

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validateFeedback(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(id, req.body,{new:true});
        if(!updatedFeedback){
            return res.status(404).json({error:"Feedback not found"});

        }
        return res.status(200).json(updatedFeedback);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a Feedback

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deleteFeedback = await Feedback.findByIdAndDelete(id);
        if(!deleteFeedback){
            return res.status(404).json({error:"Feedback not found"});
        }
        return res.status(200).json({message:"Feedback deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;

