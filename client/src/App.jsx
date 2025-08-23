import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/user/HomePage'
import Chapter from './pages/user/Chapter';
import Exercise from './pages/user/Exercise';
import Material from './pages/user/Material';
import Preview from './components/user/Preview';

import PrivateRoute from './utils/PrivateRoute';
import Login from './pages/Login'

import AdminLayout from './pages/AdminLayout'
import Admin from './pages/Admin'
import AddSubject from './components/subject/AddSubject'
import EditSubject from './components/subject/EditSubject'

import Chapters from './pages/Chapters'
import AddChapter from './components/chapters/AddChapter'
import EditChapter from './components/chapters/EditChapter'

import Exercises from './pages/Exercises'
import AddExercise from './components/exercises/AddExercise'
import EditExercise from './components/exercises/EditExercise'

import Materials from './pages/Materials'
import AddMaterial from './components/materials/AddMaterial'
import PreviewMaterial from './components/materials/PreviewMaterial'
import EditMaterial from './components/materials/EditMaterial'

function App() {

  return (
    <>
      <Router>
        <Routes>
          {/* USER */}
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/chapter/:subjectId' element={<Chapter />}></Route>
          <Route path='/exercise/:chapterId' element={<Exercise />}></Route>
          <Route path='/material/:exerciseId' element={<Material />}></Route>
          <Route path='/preview/:materialId' element={<Preview />}></Route>


          {/* ADMIN */}
          <Route path='/login' element={<Login />}></Route>

          {/* <Route path='/admin' element={<AdminLayout />}> */}
            <Route path='/admin' element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }></Route>
          {/* </Route> */}

          <Route path='/addsubject' element={<AddSubject />}></Route>
          <Route path='/editsubject/:id' element={<EditSubject />}></Route>

          <Route path='/chapters/:subjectId' element={<Chapters />}></Route>
          <Route path='/addchapter/:subjectId' element={<AddChapter />}></Route>
          <Route path='/editchapter/:chapterId' element={<EditChapter />}></Route>

          <Route path='/exercises/:chapterId' element={<Exercises />}></Route>
          <Route path='/addexercise/:chapterId' element={<AddExercise />}></Route>
          <Route path='/editexercise/:exerciseId' element={<EditExercise />}></Route>

          <Route path='/materials/:exerciseId' element={<Materials />}></Route>
          <Route path='/addmaterial/subject/:subjectId' element={<AddMaterial />}></Route>
          <Route path='/addmaterial/chapter/:chapterId' element={<AddMaterial />}></Route>
          <Route path='/addmaterial/:exerciseId' element={<AddMaterial />}></Route>
          <Route path='/editmaterial/:materialId' element={<EditMaterial />}></Route>

          <Route path='/previewmaterial/:materialId' element={<PreviewMaterial />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
