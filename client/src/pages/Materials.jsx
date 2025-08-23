import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MaterialDashboard from '../components/materials/MaterialDashboard'
import Navbar from '../components/Navbar'

const Materials = () => {
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
                    <MaterialDashboard />
                </div>
            </div>
        </>
    )
}

export default Materials