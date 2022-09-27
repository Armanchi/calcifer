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




module.exports = mongoose.model('Chore', ChoreSchema)