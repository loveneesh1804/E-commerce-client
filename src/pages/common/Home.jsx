import React, { useEffect,useState } from 'react'
import Header from '../../components/common/Header'
import Navbar from '../../components/common/Navbar'
import Banner from '../../components/common/Banner'
import Footer from '../../components/common/Footer'
import {toast} from "react-hot-toast";
import FavoriteIcon from '@mui/icons-material/Favorite';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@mui/material'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [latest,setLatest] = useState();

  useEffect(()=>{
    async function fetchProducts(){
      try{
        const res = await fetch(`${process.env.REACT_APP_SERVER}/api/product/latest`);
        const data = await res.json();

        if(data.success){
          setLatest(data.data);
        }else{
          toast.error("Cannot get Products")
        }
      }
      catch(err){
        toast.error(err)
      }
    }
    fetchProducts();
  },[])

  return (
    <>
        <Header />
        <Navbar />
        <Banner />
        <div className='latetst-products'>
            <div className='latetst-products-head'>
            <h2>Latest Products</h2>
              <span>More</span>
            </div>
            {latest ? <div className="latest-product-box">
              <Carousel responsive={responsive}>
              {latest.map((el)=>(
                <div onClick={()=>navigate(`/shop/${el._id}`)} className='product' key={el._id}>
                    <img crossOrigin='anonymous' src={el.photo} />
                    <span className='price'>₹{el.price}</span>
                    <p>{el.name}</p>
                    <span>{el.category}</span>
                    <FavoriteIcon className='heart-ico' />
                </div>
              ))
              }
              </Carousel>
            </div>: 
               <div className='skeleton-product'>
                  {new Array(4).fill(0).map(()=>(
                  <div>
                    <Skeleton variant="rounded" width={250} height={380} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} width={150} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
                  </div>
                ))}
               </div>
              }
          </div>
        <Footer />
    </>
  )
}

export default Home