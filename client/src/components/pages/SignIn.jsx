import { Link,useNavigate } from 'react-router-dom';
import {useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { signInStart,signInSuccess,signInError } from '../../redux/user/userSlice';
import OAuth from '../OAuth/OAuth.jsx';

function SignIn() {
  const [formData,setFormData]=useState({}); 
  const {loading,error}=useSelector((state)=>state.user); 
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const handleChange = (e) => {
    setFormData({...formData,
      [e.target.id]:e.target.value})
  };
  
  const handleSubmit = async  (e) => {
    e.preventDefault();  
    try {
      dispatch(signInStart());  
      const res=await fetch("https://real-estate-fcpk.onrender.com/api/auth/sign-in",{                
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(formData)
    });
      const data=await res.json();

      if(data.success===false){
        dispatch(signInError(data.message));    
      return;
    }
      dispatch(signInSuccess(data));   
      navigate("/");
  } catch(error) {
      dispatch(signInError(error.message));   
  }
};
  
  return (
    <div className="p-3 max-w-lg mx-auto">  
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">   
  
        <input type="email" placeholder="email" className="border p-3 rounded-lg" id="email" onChange={handleChange}/>
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase 
        hover:opacity-95 disabled:opacity-80">{loading ? "Loading...":"Sign In"}</button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-4'>    
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
    
  )
}

export default SignIn;