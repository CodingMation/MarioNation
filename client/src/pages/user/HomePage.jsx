import React from 'react'
import Navbar from '../../components/user/Navbar'
import Home from '../../components/user/Home'

const HomePage = () => {
    return (
        <>
            <div>
                <Navbar />
                {/* <SubjectForm /> */}
                <div className='pt-16'>
                    <Home />
                </div>
            </div>
        </>
    )
}

export default HomePage