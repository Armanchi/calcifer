const Chore = require('../models/chores')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors');
const child = require('../models/child');


const getAllChildren = async (req, res) => {
    const children = await child.find({createdBy: req.user.userId}).sort("createdAt");
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
    if (!child) throw new NotFoundError(`No chore found with id ${childId}`);
    res.status(StatusCodes.OK).json({child});
  };
  
  const createChild = async (req, res) => {
    req.body.createdBy = req.user.userId;
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
      throw new BadRequestError("Chore name or price fields cannot be empty");
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
    getAllChildren,
    getChild,
    createChild,
    updateChild,
    deleteChild,
  };