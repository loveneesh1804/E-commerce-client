import React, { useState } from 'react';
import Navbar from "../../components/common/Navbar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Sidebar from '../../components/user/Sidebar';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Mypassword = () => {

  const [newPassword,setNewPassword] = useState();
  const [oldPassword,setOldPassword] = useState();
  const user = useSelector((state)=>state.user.user);
  const navigate = useNavigate();

  if (user) {
    var decode = jwtDecode(user.token);
  }

  const handleSubmit=async()=>{
    try{
      if(!newPassword || !oldPassword){
        return toast.error("Both Fields Are Mandatory!");
      }
      if(newPassword.length<8){
        return toast.error("Password Should Contain at least 8 characters")
      }
      
      const res = await fetch(`${process.env.REACT_APP_SERVER}/api/user/reset/${decode.id}`,{
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          newPassword,
          oldPassword
        })
      });

      const result = await res.json();
      if(result.success){
        toast.success(result.message);
        return navigate(`/my/${decode.id}`);
      }
      else{
        return toast.error(result.message);
      }
    }
    catch(e){
      return toast.error(e.message);
    }

  }

  return (
    <>
        <Header />
        <Navbar />
        <section className="my">
            <Sidebar />
            <main className="user-acc-details">
            <h3>Account Security</h3>
            <form className="update-form">
              <div>
                <h4>Reset Password</h4>
              </div>
              <section className='reset-pass'>
                <div>
                    <label>Password</label>
                    <input value={oldPassword} onChange={e=>setOldPassword(e.target.value)} type="text" placeholder='Old Password' />
                </div>
                <div>
                    <label>New Password</label>
                    <input value={newPassword} onChange={e=>setNewPassword(e.target.value)} type="text" placeholder='New Password' />
                </div>
              </section>
            </form>
            <div>
              <button onClick={handleSubmit}>Reset Password</button>
            </div>
            </main>
        </section>
        <Footer />
    </>
  )
}

export default Mypassword