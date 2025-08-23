const express = require('express')
const router = express.Router()

const { addExercise, getExercises, getExercise, updateExercise, deleteExercise } = require('../controllers/exerciseController')

// http://localhost:5000/api/chapter/add
router.post('/add', addExercise);  

// http://localhost:5000/api/exercise/exercises/4423447
router.get('/exercises/:chapterId', getExercises);

// http://localhost:5000/api/subject/getexercise/4423447
router.get('/getexercise/:id', getExercise);

// http://localhost:5000/api/subject/update/4423447
router.put('/update/:id', updateExercise);

// http://localhost:5000/api/subject/delete/4423447
router.delete('/delete/:id', deleteExercise);

module.exports = router