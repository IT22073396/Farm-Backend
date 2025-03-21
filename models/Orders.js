const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');


//define payslipSchema

const orderSchema = new mongoose.Schema({
    id:{
        type:String,
        optional:[true,"Id is required"],
    },
    name:{

        type:String,
        required:[true,"Name is required"],
    },
    orderid:{
        type:String,
        required:[true,"Order ID is required"],
    },
    productid:{
        type:String,
        required:[true,"Product ID is required"],
    },
    supplierid:{
        type:String,
        required:[true,"Supplier ID is required"],
    },
    quantity:{
        type:String,
        required:[true,"Quantity is required"],
    },
    sku:{
        type:String,
        required:[true,"SKU  is required"],
    },

    createdAt: { type: Date }
});

//create model

const Order = new mongoose.model("Order",orderSchema);

const validateOrder = data => {

    const schema = Joi.object({
        id:Joi.string().optional(),
        name:Joi.string().required(),
        orderid:Joi.string().required(),
       productid:Joi.string().required(),
       supplierid:Joi.date().required(),
        quantity:Joi.string().required(),
        sku:Joi.string().required(),
    })
    return schema.validate(data);

}

module.exports = {
    validateOrder,
    Order,
}
