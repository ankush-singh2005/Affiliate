import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user,setUser] = useState({
        email:"",
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try{
            const data = await axios.post('http://localhost:5001/auth/forgot-password',user,{
                withCredentials:true
            })
            if(data.status === 200){
                console.log(data.status);
                navigate('/reset-password',{state:{email:user.email}});
            }
            else{
                console.log(data.status);
                return alert("Try Again");
            }
            
        }catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }

    };

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setUser({
            ...user,
            [name]:value,
        });
    }
  return (
    <div>
        <div className='container text-center m-4'>
            <form onSubmit={handleSubmit}>
                <div className='m-2'>
                    <label>Email: </label>
                    <input onChange={handleChange} name="email" value={user.email}></input>
                </div>
                <div>
                    <button>{loading ? "...Loading" : "Submit"}</button>
                </div>
            </form> 
        </div>
    </div>
  )
}

export default ForgetPassword