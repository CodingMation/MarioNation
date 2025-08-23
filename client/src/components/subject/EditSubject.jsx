import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AddEdit from './AddEdit'

const EditSubject = () => {
    const { id } = useParams();
    // console.log(id)
    const navigate = useNavigate();
    const token = localStorage.getItem("marioNation");

    useEffect(() => {
        if (!token) return navigate('/login');
    }, [token])
    return (
        <>
            <div>
                <AddEdit btnValue='edit' id={id} />
            </div>
        </>
    )
}

export default EditSubject