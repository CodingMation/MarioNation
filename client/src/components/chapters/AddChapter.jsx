import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import AddEdit from './AddEdit'

const AddChapter = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("marioNation");

  useEffect(() => {
      if (!token) return navigate('/login');
  }, [token])
    return (
        <>
            <div>
                <AddEdit btnValue='add' ID={subjectId} />
            </div>
        </>
    )
}

export default AddChapter