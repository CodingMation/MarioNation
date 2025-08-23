import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChapterDashboard from '../components/chapters/ChapterDashboard'
import Navbar from '../components/Navbar'

const Chapters = () => {
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
        <ChapterDashboard />
        </div>
      </div>
    </>
  )
}

export default Chapters