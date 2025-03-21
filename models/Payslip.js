const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');


//define payslipSchema

const payslipSchema = new mongoose.Schema({
    id:{

        type:String,
        required:[true,"Id is required"],
    },
    email:{
        type:String,
        required:[true,"email is required"],
    },
    name:{

        type:String,
        required:[true,"Name is required"],
    },
    date:{
        type:Date,
        required:[true,"Date is required"],
    },
    allowances:{
        type:Number,
        required:[true,"Allowance is required"],
    },
    deductions:{
        type:Number,
        required:[true,"Deduction is required"],
    },
    otherAllowances:{
        type:Number,
        required:[true,"Other Allowance is required"],
    },
    otherDeductions:{
        type:Number,
        required:[true,"Other Deduction is required"],
    },
    basic:{
        type:Number,
        required:[true,"Basic is required"],
    },
    totalAllowance:{
        type:Number,
        required:[true,"Total Allowance is required"],
    },
    totalDeduction:{
        type:Number,
        required:[true,"Total Deduction is required"],
    },
    netSalary:{
        type:Number,
        required:[true,"Net Salary is required"],
    },
    paymentMethod:{
        type:String,
        required:[true,"Payment Method is required"],
    },
    createdAt: { type: Date }
});

//create model

const PaySlip = new mongoose.model("PaySlip",payslipSchema);

const validatePayslip = data => {

    const schema = Joi.object({
        id:Joi.string().required(),
        email:Joi.string().optional(),
        name:Joi.string().required(),
       date:Joi.date().required(),
        allowances:Joi.number().required(),
        deductions:Joi.number().required(),
        otherAllowances:Joi.number().required(),
        otherDeductions:Joi.number().required(),
        basic:Joi.number().required(),
        totalAllowance:Joi.number().required(),
        totalDeduction:Joi.number().required(),
        netSalary:Joi.number().required(),
        paymentMethod:Joi.string().required(),
    })
    return schema.validate(data);

}

module.exports = {
    validatePayslip,
    PaySlip,
}
