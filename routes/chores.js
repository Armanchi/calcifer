const express = require('express')
const router = require('express').Router();

const {getAllChores, 
    getChore, 
    createChore, 
    updateChore, 
    deleteChore} = require('../controllers/chores')


router.route('/').post(createChore).get(getAllChores)
router.route('/:id').get(getChore).delete(deleteChore).patch(updateChore)

// router.route('/').post(createChore).get(getAllChores)
// router.route('/edit/:id').get(editChore)
// router.route('/delete/:id').get(deleteChore)
// router.route('/update/:id').post(updateChore)
// router.route('/add').get(addChore)




module.exports = router





