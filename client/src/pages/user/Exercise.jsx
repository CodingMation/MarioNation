import React from 'react'
import UserExercise from '../../components/user/UserExercise'
import Navbar from '../../components/user/Navbar'

const Exercise = () => {
    return (
        <>
            <div>
                <Navbar />
                <div className='pt-16'>
                    <UserExercise />
                </div>
            </div>
        </>
    )
}

export default Exercise