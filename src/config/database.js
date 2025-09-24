import mongoose from "mongoose";


export const connectDB=async()=>{
    try{
        await mongoose.connect("mongodb+srv://kratin:FCZO1QtdWSLGNWAp@devtinder.gzw23ee.mongodb.net/devTinder")
    }
    catch(err){

    }
}



// "mongodb+srv://kratin:FCZO1QtdWSLGNWAp@devtinder.gzw23ee.mongodb.net/" this will point to whole cluster
//"mongodb+srv://kratin:FCZO1QtdWSLGNWAp@devtinder.gzw23ee.mongodb.net/devTinder" this will point to specifc database