import React from 'react'
import UserMaterial from '../../components/user/UserMaterial'
import Navbar from '../../components/user/Navbar'


const Material = () => {
    return (
        <>
            <div>
                <Navbar />
                <div className='pt-16'>
                    <UserMaterial />
                </div>
            </div>
        </>
    )
}

export default Material