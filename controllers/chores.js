const {Chore, Child} = require('../models/chores')

const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors');


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

  // child Schema
  const getAllChildren = async (req, res) => {
    const children = await child.find({createdBy: req.user.userId}).sort("createdBy");
    res.status(StatusCodes.OK).json({children, count: children.length});
  };
  
  const getChild = async (req, res) => {
    const {
      user: {userId},
      params: {id: childId},
    } = req;
    const child = await Child.findOne({
      _id: childId,
    createdBy: userId,
    });
    if (!child) throw new NotFoundError(`No child found with id ${childId}`);
    res.status(StatusCodes.OK).json({child});
  };
  
  const createChild = async (req, res) => {
    req.body.postedBy = req.user.user;
    const child = await Child.create(req.body);
    res.status(StatusCodes.CREATED).json({child});
  };
  
  const updateChild = async (req, res) => {
    const {
      body: {name, balance},
      user: {userId},
      params: {id: childId},
    } = req;
    if (name === "" || balance === "")
      throw new BadRequestError("Child name filed cannot be empty");
    const child = await Child.findOneAndUpdate(
      {_id: childId, createdBy: userId},
      req.body,
      {new: true, runValidators: true}
    );
    if (!child) throw new NotFoundError(`No children found with id ${childId}`);
    res.status(StatusCodes.OK).json({job});
  };
  
  const deleteChild = async (req, res) => {
    const {
      user: {userId},
      params: {id: childId},
    } = req;
    const child = await Child.findOneAndRemove({
      _id: childId,
      createdBy: userId,
    });
    if (!child) throw new NotFoundError(`No children found with id ${childId}`);
    res.status(StatusCodes.OK).send();
  };
  
  module.exports = {
    getAllChores,
    getChore,
    createChore,
    updateChore,
    deleteChore,
    getAllChildren,
    getChild,
    createChild,
    updateChild,
    deleteChild,
  };