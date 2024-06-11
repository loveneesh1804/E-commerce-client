import React, { useEffect,useState } from 'react';
import Navbar from "../../components/common/Navbar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Sidebar from '../../components/user/Sidebar';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';

const Myorder = () => {

  const [order,setOrder] = useState([]);
  const [loading,setLoading] = useState(true);

  const user = useSelector(state=>state.user.user);
  const navigate = useNavigate();

  if(user){
    var decode = jwtDecode(user.token);
  }
  useEffect(()=>{
    const fetchOrder=async()=>{
      try{
        const res = await fetch(`${process.env.REACT_APP_SERVER}/api/order/my?id=${decode.id}`);

        const result = await res.json();
        if(result.succes){
          setLoading(false);
          setOrder(result.data);
        }
        else if(!result.data.length){
          return setLoading(false);
        }
      }catch(e){
        setLoading(false);
        return e;
      }
    }

    fetchOrder();

  },[])


  return (
    <>
        <Header />
        <Navbar />
        <section className="my">
            <Sidebar />
            <main className="user-acc-details">
            <h3>Your Orders</h3>
            <div className="my-order">
              <div className='order-search-bar'>
                <input type="text" placeholder='Order ID' />
                <button>Search</button>
              </div>
              {(order && order.length && !loading)? <>
              <div className='order-count'>
                  <span>{order.length} orders</span>
              </div>

              <div className="main-orders-box">
                {order.map(el=>(
                  <div onClick={()=>navigate(`/order/${el._id}`)} key={el._id} className="order">
                  <div className='order-stack-img'>
                    {el.orderInfo.length>1 ? el.orderInfo.map((image,i)=>(
                      <img key={i} crossOrigin='anyonmous' src={`${process.env.REACT_APP_SERVER}/${image.photo}`} alt="order" />
                    )) : <img crossOrigin='anyonmous' src={`${process.env.REACT_APP_SERVER}/${el.orderInfo[0].photo}`} alt="order" />}
                  </div>
                  <div>
                    <span>Status <span style={{color : el.status==="Cancelled" ? "red" : el.status==="Shipped" ? "purple" : el.status==="Delivered" ? "green" : "#758696"}}>{el.status}</span></span>
                    <span>Order <b># {el._id}</b></span>
                    <span>Ordered on <b>{el.createdAt.split("T")[0]}</b> </span>
                    <span>Order Total <b>₹ {el.total}.00</b> </span>
                  </div>
                </div>
                ))}

              </div>
              </> : (!order.length && !loading) ? <div style={{textAlign : "center"}}>You have no orders yet</div> :
                <div className="main-orders-box">
                  <Skeleton width={58} height={11} variant='rounded' />
                {new Array(2).fill(0).map((el,id)=>(
                  <div className="order" style={{padding : "10px"}}>
                    <div className='order-stack-img'>
                      <Skeleton width={84} height={124} variant='rounded' />
                    </div>
                    <div className='skeleton-order'>
                      <Skeleton width={86} height={15} variant='reactangular' />
                      <Skeleton width={200} height={15} variant='reactangular' />
                      <Skeleton width={140} height={15} variant='reactangular' /> 
                      <Skeleton width={100} height={15} variant='reactangular' /> 
                    </div>
                </div>
                ))}

              </div>
              }

            </div>
          </main>
        </section>
        <Footer />
    </>
  )
}

export default Myorder