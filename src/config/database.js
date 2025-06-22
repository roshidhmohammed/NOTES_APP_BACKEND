const mongoose = require("mongoose")

const connectDb = async()=>{
 await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}`)   
}

module.exports = connectDb