const Chore = require('../models/chores')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')


const getAllChores = async (req, res) => {
    const chores = await Chore.find({createdBy: req.user.userId}).sort("createdAt");
    res.status(StatusCodes.OK).json({chores, count: chores.length});
  };
  
  const getChore = async (req, res) => {
    const {
      user: {userId},
      params: {id: choreId},
    } = req;
    const chore = await Chore.findOne({
      _id: choreId,
      createdBy: userId,
    });
    if (!chore) throw new NotFoundError(`No chore found with id ${choreId}`);
    res.status(StatusCodes.OK).json({chore});
  };
  
  const createChore = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const chore = await Chore.create(req.body);
    res.status(StatusCodes.CREATED).json({chore});
  };
  
  const updateChore = async (req, res) => {
    const {
      body: {Chorename, price},
      user: {userId},
      params: {id: choreId},
    } = req;
    if (name === "" || price === "")
      throw new BadRequestError("Chore name or price fields cannot be empty");
    const chore = await Chore.findOneAndUpdate(
      {_id: choreId, createdBy: userId},
      req.body,
      {new: true, runValidators: true}
    );
    if (!chore) throw new NotFoundError(`No chore found with id ${choreId}`);
    res.status(StatusCodes.OK).json({job});
  };
  
  const deleteChore = async (req, res) => {
    const {
      user: {userId},
      params: {id: choreId},
    } = req;
    const chore = await Chore.findOneAndRemove({
      _id: choreId,
      createdBy: userId,
    });
    if (!chore) throw new NotFoundError(`No chore found with id ${choreId}`);
    res.status(StatusCodes.OK).send();
  };
  
  module.exports = {
    getAllChores,
    getChore,
    createChore,
    updateChore,
    deleteChore,
  };