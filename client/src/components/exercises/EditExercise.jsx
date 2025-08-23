import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import AddEditExercise from './AddEditExercise'

const EditExercise = () => {
    const { exerciseId } = useParams();
    // console.log(id)
    const navigate = useNavigate();
    const token = localStorage.getItem("marioNation");

    useEffect(() => {
        if (!token) return navigate('/login');
    }, [token])
    return (
        <>
            <div>
                <AddEditExercise btnValue='edit' ID={exerciseId} />
            </div>
        </>
    )
}

export default EditExercise