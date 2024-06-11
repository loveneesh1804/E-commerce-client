import React,{useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/user/action';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ComponentLogin = () => {
    const navigate = useNavigate();

    const [data,setData] = useState({});
    const user = useSelector((state)=>state.user.user);
    const [showPassword,setShowPassword] = useState();
    const dispatch = useDispatch();

    const handleChange=(e)=>{
        let inputs = e.target.name;
        setData({
            ...data,
            [inputs] : e.target.value
        })
    }

    useEffect(()=>{
        if(user){
            navigate("/")
        }
    },[])

    const handleSubmit=()=>{
        const {password,username} = data;
        if(!username){
            return toast.error("Username can't be Empty!");
        }
        if(!password){
            return toast.error("Password can't be Empty!");
        }
        const payload = {
            username,
            password
        }
        handleLogin(payload);
    }

    const handleLogin=async(payload)=>{
       try{
            const res = await fetch(`${process.env.REACT_APP_SERVER}/api/user/login`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(payload)
            });
            const data = await res.json();

            if(!data.sucess){
                return toast.error(data.message);
            }
            if(data.sucess){
                dispatch(login(data));
                toast.success(data.message);
                navigate("/")
            }
       }
       catch(err){
        return toast.error(err);
       }
    }


  return (
    <div className='signup'>
        <h1>Login</h1>
        <div className="signup-content">
            <form autoComplete='off' className='signup-form'>
                <p>Email Address</p>
                <input type="text" name='username' onChange={handleChange} placeholder='Please Enter Your Email' />
                <div className='password-sign-up'>
                    <p>Password</p>
                    {showPassword ? <VisibilityOffIcon className="visibility"  onClick={()=>setShowPassword(false)}  /> : <VisibilityIcon onClick={()=>setShowPassword(true)} className="visibility" />}
                    <input type={showPassword ? "text" : "password"} name='password' onChange={handleChange} placeholder='Please Enter Your Password' />
                </div>
                
            </form>
            <div className="signup-icon">
                <button><img src="https://cdn-icons-png.flaticon.com/128/281/281764.png" alt="icon" />Login with Google</button>
                <button><img src="https://cdn-icons-png.flaticon.com/128/1384/1384053.png" alt="icon" />Login with Facebook</button>
            </div>
        </div>
        <div className="sign-but">
            <button onClick={handleSubmit} >Login</button>
            <button onClick={()=>navigate("/signup")}>Create An Account</button>
            <p>Forgot Password?</p>
        </div>
    </div>
  )
}

export default ComponentLogin