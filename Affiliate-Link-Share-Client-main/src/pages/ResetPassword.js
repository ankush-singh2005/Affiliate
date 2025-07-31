import React, { useState } from 'react'
import axios from 'axios';
import { serverEndpoint } from '../config/config';
import { useNavigate } from 'react-router-dom';


const ResetPassword = () => {
  const navigate = useNavigate();
  const [newUserData, setNewUserData] = useState({
    code : "",
    email : "",
    newPassword: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const response = await axios.post(`${serverEndpoint}/auth/reset-password`, newUserData,{
        withCredentials: true
      });

      if(response.status === 200){
        console.log("verified");
        alert("Password changed");
        navigate('/login');
      }
      else{
        alert('Invalid credentials');
      }
    } catch(error){
      console.log(error);
    }

  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setNewUserData({
      ...newUserData,
      [name] : value
    });
  }

  return (
    <div className='container text-center m-4 p-4'>
      <h2>Reset Password Page</h2>
        <form onSubmit={handleSubmit}>
          <div className='container text-center m-2'>
            <label></label>
            <input onChange={handleChange} name='code' value={newUserData.code} placeholder='code' ></input>
          </div>
          <div className='container text-center m-2'>
            <label></label>
            <input onChange={handleChange} name='email' value={newUserData.email} placeholder='email' ></input>
          </div>
          <div className='container text-center m-2'>
            <label></label>
            <input onChange={handleChange} name='newPassword' value={newUserData.newPassword} placeholder='newPassword' ></input>
          </div>
          <div>
            <button className='btn btn-primary'>Submit</button>
          </div>
        </form>
    </div>
  )
}

export default ResetPassword