import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {useLocation, useNavigate} from "react-router-dom";

const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(state=>state.user.user);
  if(user){
    var decode = jwtDecode(user.token);
  }
  if(!user){
    navigate("/login")
  }
 

  return (
    <aside className='user-sidebar'>
        {user ? <div>
            <h2>Account</h2>
            <p style={{
              fontWeight:
                location.pathname.includes(`/my/${decode.id}`) && "600",
              backgroundColor:
                location.pathname.includes(`/my/${decode.id}`) && "white",
            }} onClick={()=>navigate(`/my/${decode.id}`)} >
              Account Details
              </p>

            <p style={{
              fontWeight:
                location.pathname.includes(`/my/password/${decode.id}`) && "600",
              backgroundColor:
                location.pathname.includes(`/my/password/${decode.id}`) && "white",
            }}  onClick={()=>navigate(`/my/password/${decode.id}`)} >Security</p>

            <p style={{
              fontWeight:
                location.pathname.includes(`/my/orders/${decode.id}`) && "600",
              backgroundColor:
                location.pathname.includes(`/my/orders/${decode.id}`) && "white",
            }}  onClick={()=>navigate(`/my/orders/${decode.id}`)} >Orders</p>

            <p style={{
              fontWeight:
                location.pathname.includes(`/my/app/${decode.id}`) && "600",
              backgroundColor:
                location.pathname.includes(`/my/app/${decode.id}`) && "white",
            }}  onClick={()=>navigate(`/my/app/${decode.id}`)} >App</p>

            <p style={{
              fontWeight:
                location.pathname.includes("/sell") && "600",
              backgroundColor:
                location.pathname.includes("/sell") && "white",
            }}  onClick={()=>navigate("/sell")} >Sell With Us</p>
        </div> : <div></div>}
    </aside>
  )
}

export default Sidebar