const express = require('express');
const router = require('express').Router();

const {getAllChildren, 
    getChild, 
    createChild, 
    updateChild, 
    deleteChild} = require('../controllers/chores');




router.route('/child').get(getAllChildren).post(createChild);
router.route('/:id').get(getChild).delete(deleteChild).patch(updateChild);






module.exports = router;