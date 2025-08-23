import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import AddEdit from './AddEdit'

const EditChapter = () => {
    const { chapterId } = useParams();
    // console.log(id)
    const navigate = useNavigate();
    const token = localStorage.getItem("marioNation");

    useEffect(() => {
        if (!token) return navigate('/login');
    }, [token])
    return (
        <>
            <div>
                <AddEdit btnValue='edit' ID={chapterId} />
            </div>
        </>
    )
}

export default EditChapter