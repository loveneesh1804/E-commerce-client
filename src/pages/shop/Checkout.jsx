import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import {useSelector,useDispatch} from "react-redux";
import Header from "../../components/common/Header";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { payment } from '../../redux/order/action';

const Checkout = () => {
  const navigate = useNavigate();
  const cart = useSelector(state=>state.cart);
  const user = useSelector(state=>state.user.user);
  const order = useSelector(state=>state.order)
  const dispatch = useDispatch();


  const [shippingInfo,setShippingInfo] = useState({});

  useEffect(()=>{
    if(!cart.length || !user){
        navigate("/cart");
    }
  },[cart])

  if(user){
    var decode = jwtDecode(user.token);
    }

  const handleChange=(e)=>{
    let inputs = e.target.name;
    setShippingInfo({
        ...shippingInfo,
        [inputs] : e.target.value
    })
  }

  const handleSubmit=async()=>{

    let {address,city,pinCode,phoneNumber,state} = shippingInfo;
        if(!address || !city || !pinCode || !phoneNumber || !state){
            return toast.error("Fill Every Field!")
        }
        const payload = {
            shippingInfo,
            user : decode.id,
            name : decode.name
        }
        console.log(payload);
        dispatch(payment(payload));
    try{
        const res = await fetch(`${process.env.REACT_APP_SERVER}/api/payment/new`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({amount : order.total})
        });

        const result = await res.json();

        if(result.succes){
            navigate("/payment",{
                state : result.clientSecret
            })
        }else{
            return toast.error("Something Went Wrong!");
        }

    }
    catch(e){
        return e;
    }
  }




  return (
    <>
        <Header />
        <Navbar />
        <section className="shipping">
            <div className="shipping-form">
                <h2>Shipping Information</h2>
                <form >
                    <div>
                        <label>Address</label>
                       <textarea name='address' onChange={handleChange}  placeholder='Your Address' cols="10" rows="5"></textarea>
                    </div>
                    <div>
                        <div>
                            <label>State</label>
                            <input name='state' onChange={handleChange}  type="text" placeholder='Your State' />
                        </div>
                        <div>
                            <label>City</label>
                            <input name='city' onChange={handleChange}  type="text" placeholder='Your City' />
                        </div>
                    </div>
                    <div>
                        <div>
                            <label>Phone Number</label>
                            <input name='phoneNumber' onChange={handleChange}  type="text" placeholder='Your Phone Number' />
                        </div>
                        <div>
                            <label>Postal Code</label>
                            <input name='pinCode' onChange={handleChange}  type="text" placeholder='Your Postal Code' />
                        </div>
                    </div>
                </form>
                <button onClick={handleSubmit} >Pay Now</button>

            </div>
        </section>
        <Footer/>
    </>
  )
}

export default Checkout