const express = require('express')
const router = express.Router()

const { upload } = require('../middleware/upload')
const { addMaterial, getMaterials, getMaterial, deleteMaterial } = require('../controllers/materialController')

// http://localhost:5000/api/material/add
router.post("/add", upload.single("file"), addMaterial);

// http://localhost:5000/api/material/getmaterials/exercise/4423447
router.get('/getmaterials/exercise/:exerciseId', getMaterials);
router.get('/getmaterials/chapter/:chapterId', getMaterials);
router.get('/getmaterials/subject/:subjectId', getMaterials);


// http://localhost:5000/api/material/getmaterial/4423447
router.get('/getmaterial/:id', getMaterial);

// http://localhost:5000/api/subject/update/4423447
// router.put('/update/:id', updateExercise);

// http://localhost:5000/api/material/delete/4423447
router.delete('/delete/:id', deleteMaterial);

module.exports = router