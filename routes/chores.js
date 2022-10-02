const express = require('express');
const router = require('express').Router();

const {getAllChores, 
    getChore, 
    createChore, 
    updateChore, 
    deleteChore,
    getAllChildren, 
    getChild, 
    createChild, 
    updateChild, 
    deleteChild
    } = require('../controllers/chores');


router.route('/').get(getAllChores).post(createChore);
router.route(':id').get(getChore).delete(deleteChore).patch(updateChore);






module.exports = router;





