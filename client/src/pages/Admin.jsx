import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SubjectDashboard from '../components/subject/SubjectDashboard'

const Admin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("marioNation");
  
  useEffect(() => {
    if (!token) return navigate('/login');
  }, [token])
  return (
    <>
      <div>
        <Navbar />
        {/* <SubjectForm /> */}
        <div className='pt-16'>
          <SubjectDashboard />
        </div>
      </div>
    </>
  )
}

export default Admin