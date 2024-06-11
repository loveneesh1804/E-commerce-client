import React, { useEffect, useState } from 'react';
import {Elements,PaymentElement,useStripe,useElements} from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import Header from "../../components/common/Header";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {resetCart} from "../../redux/cart/action";
import {reset} from "../../redux/order/action";
import { jwtDecode } from 'jwt-decode';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);


const PaymentForm=()=>{
    const [processing,setProcessing] = useState();

    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const order = useSelector(state=>state.order);
    const user = useSelector(state=>state.user.user);

    if(user){
        var decode = jwtDecode(user.token);
    }

    if(!user){
        return navigate("/login");
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();

        if(!stripe || !elements){
            return toast.error("Something Went Wrong!");
        }
        setProcessing(true);

        const {paymentIntent,error} = await stripe.confirmPayment({
            elements,
            confirmParams : { return_url : window.location.origin },
            redirect : "if_required",
        });

        if(error){
            setProcessing(false);
            return toast.error(error.message || "Oops Something Went Wrong!")
        }

        const handleOrder=async()=>{
            try{
                const res = await fetch(`${process.env.REACT_APP_SERVER}/api/order/new`,{
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify(order)
                })
        
                const result = await res.json();
        
                if(result.succes){
                    dispatch(resetCart());
                    dispatch(reset());
                    toast.success("Order Placed Successfully!");
                    setProcessing(false);
                    return navigate(`/my/orders/${decode.id}`);
                }
            }
            catch(e){
                return e;
            }
          }

        if(paymentIntent.status==="succeeded"){
               handleOrder();
        }

        setProcessing(false);
    };

    
    

    return(
        <div className='payment-box'>
            <h2>Online Payment</h2>
            <form onSubmit={handleSubmit} className='payment-form'>
                <PaymentElement />
                <button type='submit' disabled={processing} >{processing ? "Processing..." : `Pay ₹ ${order.total}.00`}</button>
            </form>
        </div>
    )
}

const Payment = () => {
    const [captcha,setCaptcha] = useState();
    const [code,setCode] = useState();
    const location = useLocation();
    const clientSecret = location.state;

    useEffect(()=>{
        const data = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOQRSTUVWXYZ";
        var randCode = "";
        for(var i=0;i<6;i++){
            randCode += data[Math.floor(Math.random() * data.length)] 
        }
        setCode(randCode)
    },[])

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const order = useSelector(state=>state.order);
    const user = useSelector(state=>state.user.user);

    if(user){
        var decode = jwtDecode(user.token);
    }

    if(!user){
        return navigate("/login");
    }
    
    const handleCashOnDelivery=async(e)=>{
        try{
            e.preventDefault();
            if(!captcha){
                return toast.error("Enter Captcha To Place Order");
            }
            if(captcha !== code){
                return toast.error("Invalid Captcha");
            }
            const res = await fetch(`${process.env.REACT_APP_SERVER}/api/order/new`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(order)
            })
    
            const result = await res.json();

            if(result.succes){
                dispatch(resetCart());
                dispatch(reset());
                toast.success("Order Placed Successfully!");
                return navigate(`/my/orders/${decode.id}`);
            }
            else{
                return toast.error("Something Went Wrong!")
            }

        }
        catch(e){
            return toast.error(e.message);   
        }
    }

    

    

    if(!clientSecret){
        return <Navigate to={"/checkout"} />;
    }
    

  return (
    <>
        <Header />
        <Navbar />
        <Elements options={{clientSecret}} stripe={stripePromise}>
            <PaymentForm />
        </Elements>
        <div className='payment-box'>
        <h2>Cash On Delivery</h2>
            <form onSubmit={handleCashOnDelivery} className='cash'>
                <div>
                    <input value={captcha} onChange={e=>setCaptcha(e.target.value)} type="text" placeholder='Enter Captcha to Place Order' />
                    <code>{code}</code>
                </div>
                <button type='submit' >Place Order</button>
            </form>
        </div>
        <Footer />
    </>
    
  )
}

export default Payment;



// 4000003560000008