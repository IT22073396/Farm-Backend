const mongoose = require('mongoose');
const Joi = require('joi');
const { USER_TYPES } = require('../constants');


//define financialSchema

const financialSchema = new mongoose.Schema({
    id:{

        type:String,
        required:[true,"ID is required"],
    },
    dduration:{

        type:Number,
        required:[true,"Day Duration is required"],
    },
    tsale:{

        type:Number,
        required:[true,"Total Sales is required"],
    },
    tcost:{
        type:Number,
        required:[true,"Total Cost is required"],
    },
    cofPsales:{
        type:Number,
        required:[true,"Count of Product Sales is required"],
    },
    createdAt: { type: Date }
});

//create model

const Financial = new mongoose.model("Financial",financialSchema);

const validateFinancial = data => {

    const schema = Joi.object({
        id:Joi.string().optional(),
        dduration:Joi.number().required(),
        tsale:Joi.number().required(),
        tcost:Joi.number().required(),
        cofPsales:Joi.number().required(),

    })
    return schema.validate(data);

}

module.exports = {
    validateFinancial,
    Financial,
}