import React from 'react'
import UserChapter from '../../components/user/UserChapter'
import Navbar from '../../components/user/Navbar'

const Chapter = () => {
  return (
    <>
      <div>
        <Navbar />
        <div className='pt-16'>
        <UserChapter />
        </div>
      </div>
    </>
  )
}

export default Chapter