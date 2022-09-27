const Chore = require('../models/chores')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')


const getAllChores = async (req, res) => {
    res.send('get all chores')
}

// const getAllChores = async (req,res) =>{
//     const chores = await Chore.find({createdBy:req.user.userId}).sort('createdAt')
//     res.status(StatusCodes.OK).json({ chores, count: chores.length })
// }


const getChore = async (req, res) => {
    res.send('get chore')
}

const createChore = async (req,res) =>{ 
    req.body.createdBy = req.user
    const chore = await Chore.create(req.body)
    res.status(StatusCodes.CREATED).json({chore})
}

const updateChore = async (req, res) => {
    res.send('update chore')
}

const deleteChore = async (req, res) => {
    res.send('deleteChore')
}



module.exports = {
    getAllChores,
    getChore,
    createChore,
    updateChore,
    deleteChore,
}