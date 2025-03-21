const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');


//define invoiceSchema

const invoiceSchema = new mongoose.Schema({
    id:{

        type:String,
        required:[true,"ID is required"],
    },
    cname:{

        type:String,
        required:[true,"Customer Name is required"],
    },
    orderid:{

        type:Number,
        required:[true,"Order ID is required"],
    },
    orderedDate:{
        type:Date,
        required:[true,"Ordered Date is required"],
    },
    tamount:{
        type:Number,
        required:[true,"Total Amount is required"],
    },
    
    createdAt: { type: Date }
});

//create model

const Invoice = new mongoose.model("Invoice",invoiceSchema);

const validateInvoice = data => {

    const schema = Joi.object({
        id:Joi.string().optional(),
        cname:Joi.string().required(),
        orderid:Joi.number().required(),
        orderedDate:Joi.date().required(),
        tamount:Joi.number().required(),
    })
    return schema.validate(data);

}

module.exports = {
    validateInvoice,
   Invoice,
}