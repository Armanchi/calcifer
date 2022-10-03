const mongoose = require('mongoose');



const ChoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide chore name'],
        trim: true,
        maxlength: [50, 'chore name can not exceed fifty characters'],
    },
    price: {
        type: Number,
        required: [true, 'please provide chore payment'],
    },
    status:{
        type:String,
        enum:['completed', 'incomplete', 'pending'],
        default: 'pending',
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required:[true, 'Please provide user']
    },
    assignedTo: {
        type: [{ 
        type: mongoose.Types.ObjectId,
        ref: "User" }],
        required: true,
      },
      createdDate: { 
        type: Date, 
        default: Date.now },
    });

    // //child model
const childSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'must provide childs name'],
        maxlength: 50,
    },
    role: { 
        type: String,
        default: "children", 
    },
    balance: {
        type: Number,
        default: 0,
    },
    //this is a bug, can not use userId for both to CRUD
    CreatedBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
})

    


const Chore = mongoose.model('Chore', ChoreSchema)
const Child = mongoose.model('Child', childSchema)

module.exports = {
    Chore, 
    Child
}
