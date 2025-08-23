import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import AddEditExercise from './AddEditExercise'

const AddChapter = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("marioNation");

  useEffect(() => {
      if (!token) return navigate('/login');
  }, [token])
    return (
        <>
            <div>
                <AddEditExercise btnValue='add' ID={chapterId} />
            </div>
        </>
    )
}

export default AddChapter