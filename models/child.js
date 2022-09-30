const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({

        name: {
            type: String,
            required: [true, 'must provide childs name'],
            maxlength: 50,
        },
        role: { 
            type: String,
            default: "children" 
        },
        balance: {
            type: Number,
            default: 0,
        },
        //this is a bug, can not use userId for both to CRUD
        CreatedBy:{
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required:[true, 'Please provide user'],
        },
    })
    



module.exports = mongoose.model('Child', childSchema)