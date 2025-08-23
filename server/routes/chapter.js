const express = require('express')
const router = express.Router()

const { addChapter, getChapters, getChapter, updateChapter, deleteChapter } = require('../controllers/chapterController')

// http://localhost:5000/api/chapter/add
router.post('/add', addChapter);  

// http://localhost:5000/api/chapter/chapters/4423447
router.get('/chapters/:subjectId', getChapters);

// http://localhost:5000/api/subject/getchapter/4423447
router.get('/getchapter/:id', getChapter);

// http://localhost:5000/api/subject/update/4423447
router.put('/update/:id', updateChapter);

// http://localhost:5000/api/subject/delete/4423447
router.delete('/delete/:id', deleteChapter);

module.exports = router