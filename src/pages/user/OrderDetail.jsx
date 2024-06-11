import React, { useEffect, useState } from 'react';
import Navbar from "../../components/common/Navbar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams,useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { Skeleton } from '@mui/material';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [data,setData] = useState();
  const [orderCancel,setCancel] = useState();
  const user = useSelector(state=>state.user.user);

  if(user){
    var decode = jwtDecode(user.token);
  }

  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const res = await fetch(`${process.env.REACT_APP_SERVER}/api/order/${params.id}`);
        const result = await res.json();

        if(result.succes){
          return setData(result.data);
        }
      }catch(e){
        return e;
      }
    }
    fetchData();
  },[])

  const handleCancel=async()=>{
    try{
      const res = await fetch(`${process.env.REACT_APP_SERVER}/api/order/cancel/${data._id}`,{
        method : "PUT"
      });

      const result = await res.json();
      if(result.succes){
        toast.success(result.message);
        return navigate(`/my/orders/${decode.id}`)
      }
      else{
        return toast.error("Something Went Wrong");
      }
    }catch(e){
      return toast.error("Invalid Action")
    }
  }

  return (
    <>
        <Header />
        <Navbar />
        <section onClick={(e)=>(e.target.className!=="cancel-order" && orderCancel) && setCancel(false)} className='order-invoice'>
            <div className="invoice-box">
              <div className="invoice-head">
                <h2>Order Details</h2>
                <div>
                  <ArrowBackIcon />
                  <span onClick={()=>navigate(`/my/orders/${decode.id}`)}>Back To Orders</span>
                </div>
              </div>

              <div className="invoice-details">
                {data ? <div>
                  <div>
                      <span>Order ID</span>
                      <span>Order Date</span>
                      <span>Address</span>
                  </div>
                  <div>
                      <b>{data._id}</b>
                      <b>{data.createdAt.split("T")[0]}</b>
                      <b>{data.shippingInfo.address}</b>
                  </div>
                </div> : <div>
                  <div>
                      <span>Order ID</span>
                      <span>Order Date</span>
                      <span>Address</span>
                  </div>
                  <div className='my-order-skeleton'>
                      <Skeleton width={280} height={14} variant='rounded' />
                      <Skeleton width={140} height={14} variant='rounded' />
                      <Skeleton width={280} height={30} variant='rounded' />
                  </div>
                </div> }
                
                {data ? <div className='cancel-order'>
                  <button disabled={data.status === "Cancelled" && true} onClick={()=>setCancel(!orderCancel)} >Cancel Order</button>
                  <div style={{visibility : orderCancel ? "visible" : "hidden"}} className='confirm-cancel'>
                      <p>Are you sure you want to cancel this order ?</p>
                      <button onClick={handleCancel}>Confirm Cancel</button>
                  </div>
                </div> 
                : <div>
                  <Skeleton variant='rounded' width={109} height={37} />
                  </div>}

              </div>

              <div className="invoice-main">
                <div className='invoice-order'>
                    <h2>Order Items</h2>
                    <div className="order-list-invoice">
                      {data ? data.orderInfo.map((el,i)=>(
                        <div key={i} className="invoice-item">
                        <div>
                          <img crossOrigin='anyonymous' src={`${process.env.REACT_APP_SERVER}/${el.photo}`} alt="order" />
                            <div>
                            <b>{el.name}</b>
                            <span>₹ {el.price}</span>
                            <span>Size : {el.size}</span>
                          </div>
                        </div>
                        <div>
                          <span style={{color : data.status==="Cancelled" ? "red" : data.status==="Shipped" ? "purple" : data.status==="Delivered" ? "green" : "#758696"}}>{data.status}</span>
                          <p>Status</p>
                        </div>
                        <div>
                          <span>{el.quantity}</span>
                          <p>Quantity</p>
                        </div>
                        <div>
                          <strong>₹ {el.price * el.quantity}.00</strong>
                          <p>Total Price</p>
                        </div>
                      </div>
                      ))  : new Array(2).fill(0).map((el,i)=>(
                        <div key={i} className="invoice-item">
                        <div>
                            <Skeleton variant='rounded' width={80} height={120} />
                            <div className='skeleton-flex'>
                            <Skeleton variant='reactangular' width={150} height={40} />
                            <Skeleton variant='reactangular' width={80} height={14} />
                            <Skeleton variant='reactangular' width={50} height={14} />
                          </div>
                        </div>
                        <div>
                          <Skeleton variant='rounded' width={140} height={14} />
                        </div>
                        <div>
                          <Skeleton variant='rounded' width={30} height={14} />
                        </div>
                        <div>
                          <Skeleton variant='rounded' width={80} height={14} />
                        </div>
                      </div>
                      )) }
                    </div>
                </div>

                <div className='invoice-summary'>
                    <h2>Order Summary</h2>
                   {data ? <div className="invoice-total">
                      <div>
                        <span>Subtotal</span>
                        <b>₹ {data.subtotal}.00</b>
                      </div>
                      <div>
                        <span>Discount</span>
                        <b style={{color:"red"}}>{data.discount>0 ? `- ₹ ${data.discount}.00` : "No Discount"}</b>
                      </div>
                      <div>
                        <span>Est. Sales Tax</span>
                        <b>₹ {data.tax}.00</b>
                      </div>
                      <div>
                        <span>Shipping & Handling</span>
                        <b>{data.shipping===0 ? "Free" : `₹ ${data.shipping}.00`}</b>
                      </div>
                      <div>
                        <span>Total</span>
                        <b>₹ {data.total}.00</b>
                      </div>
                    </div> :  <div className="invoice-total">
                      <div>
                        <span>Subtotal</span>
                        <Skeleton variant='reactangular' width={100} height={20} />
                      </div>
                      <div>
                        <span>Discount</span>
                        <Skeleton variant='reactangular' width={100} height={20} />
                      </div>
                      <div>
                        <span>Est. Sales Tax</span>
                        <Skeleton variant='reactangular' width={100} height={20} />
                      </div>
                      <div>
                        <span>Shipping & Handling</span>
                        <Skeleton variant='reactangular' width={100} height={20} />
                      </div>
                      <div>
                        <span>Total</span>
                        <Skeleton variant='reactangular' width={100} height={20} />
                      </div>
                    </div>}
                </div>
              </div>
            </div>
        </section>
        <Footer />
    </>
  )
}

export default OrderDetail