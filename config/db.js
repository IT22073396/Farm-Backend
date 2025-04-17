const mongoose = require('mongoose');

const connectDB = async ()=> {

    //return here upon a promise and chain on a promise 
    //if connected db successfully do console log 
    //and if any error console log error
   
    return mongoose.connect("mongodb+srv://imalkathushan2000:ZikP1punx8lipboe@cluster-123.xjfnxx0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-123")
    .then(() => console.log(`connection to database established...`))
    .catch((err) => console.log(err));
};

module.exports = connectDB;