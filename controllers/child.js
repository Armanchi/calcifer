const Child = require('../models/child')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors');

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
    getAllChildren,
    getChild,
    createChild,
    updateChild,
    deleteChild,
  };