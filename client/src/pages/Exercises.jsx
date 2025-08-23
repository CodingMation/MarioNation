import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ExerciseDashboard from '../components/exercises/ExerciseDashboard'
import Navbar from '../components/Navbar'

const Exercises = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("marioNation");
    
    useEffect(() => {
    if (!token) return navigate('/login');
  }, [token])
    return (
        <>
            <div>
                <Navbar />
                <div className='pt-16'>
                    <ExerciseDashboard />
                </div>
            </div>
        </>
    )
}

export default Exercises