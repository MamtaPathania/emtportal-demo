import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import img from '../assets/img5.png'
import Cookies from 'js-cookie';

// import {FaUnlockAlt} from 'react-icons/fa'
import { FaEye, FaEyeSlash, FaUser,FaLock } from 'react-icons/fa';

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

    const navigate=useNavigate()
    const togglePasswordVisibility = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const[input,setInput]=useState({
        //   name:"",
          username:'',
          password:'',
        })

    const handleChange=(e)=>{
        setInput(
            {...input,
            [e.target.name]:e.target.value
            
        })
    }
        
console.log(input)
    const handleSubmit=(e)=>{
        e.preventDefault(); 

        axios.post('http://localhost:6079/login', {
  username: input.username,
  password: input.password,
})
.then((res) => {
  Cookies.set('token',res.data.message.token)
  const token= Cookies.get('token')
console.log("============",res.data.message.token)
if(token){
  navigate('/emt-service')
}
})
.catch((err) => {
  console.log(err)
  alert("Enter valid email or password");
});
    setInput({
        username:'',
        password:'',  
      }) 
    
    
    }
  
  return (
    <form onSubmit={handleSubmit}className='flex justify-center items-center bg-blue-400 h-screen'>
<div className='bg-white lg:h-[440px] lg:w-[400px] h-[440px] w-[350px] md:h-[460px] md:w-[410px] rounded-lg flex justify-center items-center'>
      <div className='flex-col flex justify-center items-center w-[220px] mt-1'>
     <img src={img} alt="login" className='w-[70px] '/> 
     <h2 className='text-center p-4 text-gray-700 text-[25px] font-medium'>LOGIN</h2>
    
      <div className=''>
        <label className='text-black text-[17px] '>Username</label>
        

        <div className='relative'>
          <input
            className='rounded-lg p-3 pl-10 w-[250px] border-2 border-black hover:border-gray-400' // Adjusted padding to accommodate the icon
            type="text"
            name="username"
            placeholder="Enter Your Username"
            required
            value={input.username}
            onChange={handleChange}
          />
          <FaUser className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500' />
        </div>
              </div>
      <div className='m-5'>
      <label className='text-black text-[17px]'>Password</label>
      <div className='relative'>
            <FaLock className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500' />
            <input
              className='rounded-lg p-3 pl-10 w-[250px] border-2 border-black hover:border-gray-400'
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder='Confirm Password'
              required
              value={input.password}
              onChange={handleChange}
            />
            {showPassword ? (
              <FaEyeSlash
                className='absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500'
                onClick={togglePasswordVisibility}
              />
            ) : (
              <FaEye
                className='absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer text-gray-500'
                onClick={togglePasswordVisibility}
              />
            )}
          </div>
    </div>
      <div className='text-center m-4'>
      <button type="submit" className="lg:w-[150px] lg:text-[20px] text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">Login</button>
      </div>
    
    </div>
</div>

</form>
  )
}

export default Signup
