import React, { useEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Sidebar from '../../../components/admin/AdminSidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import {toast} from "react-hot-toast";
import DeleteIcon from '@mui/icons-material/Delete';
import { Skeleton } from '@mui/material';

const Manage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [data,setData] = useState();
  const [modal,setModal] = useState();
  const [deleteModal,setDelete] = useState();
  const user = useSelector(state=>state.user.user);
  
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

  if(user){
    var decode = jwtDecode(user.token);
  }

  const handleStatus=async()=>{
    try{
        
        const res = await fetch(`${process.env.REACT_APP_SERVER}/api/order/${params.id}?id=${decode.id}`,{
            method : "PUT",
            headers : {
                "Content-Type" : "Application/json"
            }
        });

        const result = await res.json();

        if(result.succes){
            toast.success("Status Updated!")
            return navigate("/admin/transactions");
        }

    }catch(e){
        return e;
    }
  }

  const handleDelete=async()=>{
    try{
        const res = await fetch(`${process.env.REACT_APP_SERVER}/api/order/${params.id}?id=${decode.id}`,{
            method : "DELETE",
            headers : {
                "Content-Type" : "Application/json"
            }
        });

        const result = await res.json();

        if(result.succes){
            toast.success("Order Deleted!")
            return navigate("/admin/transactions");
        }

    }catch(e){
        return e;
    }
  }


  return (
    <>
        <div className='admin-products'>
            <Sidebar />
            {data ? 
            <div className='manage-order'>
                <div onClick={()=>navigate("/admin/transactions")} className="back">
                    <ArrowBackIosIcon />
                </div>
                <div  className='orders'>
                    <h2>Order Items</h2>
                    {data.orderInfo.map((el,i)=>(
                        <div className='order-manage' key={i}>
                        <div>
                            <img crossOrigin='anyonymous' src={el.photo} alt="order" />
                            <div>
                                <span>{el.name}</span>
                                <span>Quantity : {el.quantity}</span>
                                <span>Size : {el.size}</span>
                            </div>
                        </div>
                        <div>
                            <strong>₹ {el.price}.00</strong>
                        </div>
                    </div>
                    ))}
                </div>
                <div className='product-manage orders-details'>
                <DeleteIcon onClick={()=>setDelete(true)} style={{fontSize : "30px"}} className='del-ico-product' />
                    <h2>Order Info</h2>
                    <div>
                        <h5>User Info</h5>
                        <p>Name : {data.name}</p>
                        <p>Address : {data.shippingInfo.address}</p>
                    </div>
                    <div>
                        <h5>Amount Info</h5>
                        <p>Discount : {!data.discount ? "Zero Discount" : `₹ ${data.discount}.00`}</p>
                        <p>Shipping : {data.shipping===0 ? "Free" : `₹ ${data.shipping}.00` }</p>
                        <p>Tax : ₹ {data.tax}.00</p>
                        <p>Total : ₹ {data.total}.00</p>
                    </div>
                    <div>
                        <h5>Status Info</h5>
                        <p>Status : <span style={{
                        color:
                        data.status === "Delivered"
                            ? "green"
                            : data.status === "Shipped"
                            ? "purple"
                            : data.status === "Processing"
                            ? "orange" : "black",
                    }}>{data.status}</span></p>
                    </div>
                    <button onClick={()=>{
                        if(data.status==="Delivered"){
                            return toast.error("Order Has Alredy Delivered")
                        };
                        setModal(true)
                    }}>Process Status</button>
                </div>
            </div> : <div className='manage-order'>
                <div  className='orders'>
                    <h2>Order Items</h2>
                    {new Array(3).fill(0).map((el,i)=>(
                        <div className='order-manage' key={i}>
                        <div>
                            <Skeleton variant='rounded' width={60} height={90} />
                            <div>
                                <Skeleton variant='rounded' width={200} height={35} />
                                <Skeleton variant='rounded' style={{margin : "4px 0px"}} width={100} height={18} />
                                <Skeleton variant='rounded' width={60} height={18} />
                            </div>
                        </div>
                        <div>
                            <Skeleton variant='rounded' width={70} height={18} />
                        </div>
                    </div>
                    ))}
                </div>
                <div className='product-manage orders-details dummy-div'>
                    <h2>Order Info</h2>
                    <div>
                        <Skeleton variant='rounded' width={140} height={18} />
                        <Skeleton variant='rounded' style={{margin : "4px 0px"}} width={200} height={18} />
                        <Skeleton variant='rounded' width={250} height={40} />

                    </div>
                    <div className='skeleton-flex-1'>
                        <Skeleton variant='rounded' width={100} height={18} />
                        <Skeleton variant='rounded' width={120} height={18} />
                        <Skeleton variant='rounded' width={120} height={18} />
                        <Skeleton variant='rounded' width={120} height={18} />
                        <Skeleton variant='rounded' width={120} height={18} />
                    </div>
                    <div>
                        <Skeleton variant='rounded' width={80} height={18} />
                        <Skeleton variant='rounded' style={{margin : "4px 0px"}} width={200} height={18} />
                    </div>
                    <Skeleton style={{margin:"160px 0px 0px 40px"}} variant='rounded' width={230} height={42.5} />
                </div>
            </div> }
        </div>

        {data && <div className="update-modal"
        onClick={(e)=>e.target.className==="update-modal" && setModal(false)}
         style={{visibility : modal ? "visible" : "hidden"}}>
            <div className="update-modal-box" style={{left : modal ? "50%" : "-50%"}}>
                <div>
                    <div>
                        <h3>Update Status</h3>
                        <p>Are you sure, you want to update status ?</p>
                    </div>
                    <div>
                        <button onClick={()=>setModal(false)}>Cancel</button>
                        <button style={{backgroundColor:"#0073FF"}} onClick={handleStatus}>Update</button>
                    </div>
                </div>
            </div>
        </div>}

        {data && <div className="update-modal"
        onClick={(e)=>e.target.className==="update-modal" && setDelete(false)}
         style={{visibility : deleteModal ? "visible" : "hidden",backgroundColor : "rgba(0,0,0,0.5)"}}>
            <div className="update-modal-box" style={{left : deleteModal ? "50%" : "-50%"}}>
                <div>
                    <div>
                        <h3>Delete Order</h3>
                        <p>Are you sure, you want to delete order ?</p>
                    </div>
                    <div>
                        <button onClick={()=>setDelete(false)}>Cancel</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </div>}
    </>
  )
}

export default Manage


