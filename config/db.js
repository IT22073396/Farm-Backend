const mongoose = require('mongoose');

const connectDB = async ()=> {

    //return here upon a promise and chain on a promise 
    //if connected db successfully do console log 
    //and if any error console log error
   
    return mongoose.connect("mongodb+srv://it22056320:WRNil6IwN4PJjsFM@cluster0.jig0tud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log(`connection to database established...`))
    .catch((err) => console.log(err));
};

module.exports = connectDB;