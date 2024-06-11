import React, { useState,useEffect } from 'react';
import Sidebar from '../../../components/admin/AdminSidebar';
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";
import CloseIcon from '@mui/icons-material/Close';
import { Skeleton } from '@mui/material';

const Coupon = () => {
  const [prefix,setPrefix] = useState("");
  const [size,setSize] = useState(8);
  const [coupon,setCoupon] = useState();
  const [copied,setCopied] = useState(false);
  const [err,setErr] = useState(false);
  const [errMessage,setErrMessage] = useState("");
  const [discount,setDiscount] = useState();


  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [data, setData] = useState();
  const [loading,setLoading] = useState(true);

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER}/api/payment/coupon/all?id=${decode.id}`
        );
        const result = await res.json();

        if(result.succes) {
          setLoading(false);
          return setData(result.data);
        }else{
          return setLoading(false);
        }
      } catch (err) {
        return err;
      }
    };
    fetchData();
  }, []);

  if (!user) {
    return navigate("/");
  }
  if (user) {
    var decode = jwtDecode(user.token);
    if (decode.role !== "admin") {
      navigate("/");
    }
  }






  const copyText=async(coupon)=>{
    await window.navigator.clipboard.writeText(coupon);
    setCopied(true);
  }

  const handleSubmit=(e)=>{
      e.preventDefault();
      if(!prefix || !size || !discount){
        setErrMessage("Please Enter All Field!");
        setErr(true);
      }
      if(prefix.length!==Number(size)){
        setErrMessage("Invalid Coupon Length!");
        setErr(true);
      }
      else{
        setCopied(false);
        newCoupon(prefix.toUpperCase(),discount);
      }
  }

  const newCoupon=async(coupon,discount)=>{
    try{
      const res = await fetch(`${process.env.REACT_APP_SERVER}/api/payment/coupon/new?id=${decode.id}`,{
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          coupon,discount
        })
      });
      const result = await res.json();

      if(result.succes){
        let id = setTimeout(()=>{
          window.location.reload(true);
          return ()=>clearTimeout(id);
        },1000)
        return toast.success(result.message);
      }else{
        return toast.error(result.message);
      }
    }
    catch(e){
      return toast.error(e.message);
    }
  }

  const deleteCoupon=async(id)=>{
    try{
      const res = await fetch(`${process.env.REACT_APP_SERVER}/api/payment/coupon/${id}?id=${decode.id}`,{
        method : "DELETE"
      });
      const result = await res.json();

      if(result.succes){
        return window.location.reload(true);
      }
    }
    catch(e){
      return toast.error(e.message);
    }
  }

  return (
    <div className='coupon'>
      <Sidebar />
      <main className='app-container'>
        <h1>Coupons</h1>
        <div className='coupon-container'>
          <form className="coupon-form" onSubmit={handleSubmit}>
            <div className='first'>
              <div className="form-group f2" >
                  <label>Coupon</label>
                  <input onChange={(e)=>setPrefix(e.target.value)} value={prefix} maxLength={size} type="text" placeholder='Enter Coupon Code to generate' />
              </div>
              <div className="form-group f2" >
                  <label>Size</label>
                  <input type="Number" value={size} min={8} max={15} onChange={(e)=>Number(setSize(e.target.value))} placeholder='Coupon Length' />
              </div>
              <div className="form-group f2">
                <label >Discount</label>
                <input value={discount} onChange={e=>setDiscount(e.target.value)} type="number" placeholder='Enter Discount' />
              </div>
            </div>
            <fieldset>
              <legend>Coupon Code</legend>
              {(!coupon && !err) ? <span>Generated Code Will be Viewed Here!</span> :(!coupon || err) && <span style={{color : "red"}}>{errMessage}</span> }
              {(coupon && !err ) && <code>{coupon}<span onClick={()=>copyText(coupon)}>{copied ? "Copied":"Copy"}</span></code>}
            </fieldset>

            <button>Generate</button>
          </form>


        </div>
        {data && !loading ? <div className='coupon-display'>
            {data.map(el=>(
            <div onClick={()=>setCoupon(el.coupon)} key={el._id} className="coupon-code">
                <h2 onClick={()=>setCoupon(el.coupon)}>{el.coupon}</h2>
                <span onClick={()=>setCoupon(el.coupon)}>{el.discount}% Discount</span>
                <CloseIcon onClick={()=>deleteCoupon(el._id)} />
            </div>))}
        </div>: !data && !loading ?
            <h1 style={{margin:"20px 12.4%"}} className='no-coupon'>No Coupons Yet</h1>
        : <div className='coupon-display'>
              {new Array(4).fill(0).map((el,i)=>(
                <div className='coupon-code'>
                  <Skeleton variant='rounded' style={{marginBottom : "4px"}} width={100} height={14} />
                  <Skeleton variant='rounded' width={130} height={50} />
                </div>
              ))}
          </div>}
      </main>
    </div>
  )
}

export default Coupon