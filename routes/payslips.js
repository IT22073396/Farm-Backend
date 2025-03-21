const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const { validatePayslip, PaySlip } = require("../models/Payslip");
const { USER_TYPES } = require("../constants");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "your_email@gmail.com",
      pass: "your_app_password",
    },
  });

const sendEmailNotification = async (email,action) => {
    const mailOptions = {
        from:'udulacode@outlook.com',
        to:email,
        subject:'Payslip Notification',
        text:`Dear Employee,\n\nYour payslip has been ${action}.\n\nRegards,\nMandri Life `
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:',info.response);
    } catch (error) {
        console.error('Error sending email:',error);
    }
};

//create payslip


router.post("/", async(req,res) => {
    const { error } = validatePayslip(req.body);
    const {email, id,name,date,allowances,deductions,
          otherAllowances,otherDeductions,
          basic,totalAllowance,totalDeduction,netSalary,paymentMethod} 
          = req.body;

          if(error){
            return res.status(400).json({ error:error.details[0].message })
          }
          try {
            const newPayslip = new PaySlip({...req.body,
                createdAt:new Date()});
            const result = await newPayslip.save();
            await sendEmailNotification(req.body.email,'created');
            return res.status(201).json(result);
            
          } catch (err) {
            console.log(err);
            return res.status(500).json({error:err.message})
          }

});

//get all payslips

router.get("/", async(req,res) => {
    try {
        const payslips = await PaySlip.find().sort({createdAt:-1});
        return res.status(200).json({payslips});        
    } catch (err) {
        console.log(err);
        return res.status(400).json({error:err.message});
    }
});

//get a single payslip by ID

router.get("/:id", async(req,res) => {
    const { id } = req.params;
    if (!id) { return res.status(400).json({ error: "no id specified." }); }
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a vallid id"});
    }

    try {
        const payslip = await PaySlip.findById(id);

        if(!payslip) {
            return res.status(404).json({error:"PaySlip not found"});
        }
        return res.status(200).json(payslip);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error:err.message });
    }
})

//update a payslip

router.put("/:id", async(req,res) => {

    const {id} =req.params;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    const {error} = validatePayslip(req.body);
    if(error) {
        return res.status(400).json({error:error.details[0].message});
    }
    try {
        const updatedPayslip = await PaySlip.findByIdAndUpdate(id, req.body,{new:true});
        await sendEmailNotification(req.body.email,'updated');
        if(!updatedPayslip){
            return res.status(404).json({error:"Payslip not found"});

        }
        return res.status(200).json(updatedPayslip);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
        
    }
});

//delete a paysslip

router.delete("/:id", async(req,res) => {
    const {id} = req.params;
    const email = req.query.email;
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).json({error:"Please enter a valid id"});
    }
    try {
        const deletePayslip = await PaySlip.findByIdAndDelete(id);
        await sendEmailNotification(email,'deleted');
        if(!deletePayslip){
            return res.status(404).json({error:"Payslip not found"});
        }
        return res.status(200).json({message:"Payslip deleted Successfully"});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:err.message});
    }
})

module.exports = router;

