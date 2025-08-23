const express = require('express')
const router = express.Router()

const { addSubject, getSubjects, getSubject, updateSubject, deleteSubject } = require('../controllers/subjectController')

// http://localhost:5000/api/subject/add
router.post('/add', addSubject);

// http://localhost:5000/api/subject/subjects
router.get('/subjects', getSubjects);

// http://localhost:5000/api/subject/getsubject/4423447
router.get('/getsubject/:id', getSubject);

// http://localhost:5000/api/subject/update/4423447
router.put('/update/:id', updateSubject);

// http://localhost:5000/api/subject/delete/4423447
router.delete('/delete/:id', deleteSubject);

module.exports = router