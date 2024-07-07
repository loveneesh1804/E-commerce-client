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
  },
  mobile: {
    breakpoint: { max: 1000, min: 0 },
    items: 3,
    slidesToSlide: 3
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [latest,setLatest] = useState();
  const [isMobile,setIsMobile] = useState(false);

  useEffect(()=>{
    window.addEventListener("resize",()=>{
      window.innerWidth<1200 ? setIsMobile(true) : setIsMobile(false);
    })
    window.innerWidth<1200 && setIsMobile(true);
    
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
                    <div>
                      <img crossOrigin='anonymous' src={'https://res.cloudinary.com/djwpcqv3o/image/upload/v1720000389/ipopaeaydb7xtph7n7kr.jpg'} alt='por-ico' />
                      <span className='price'>₹{el.price}</span>
                    </div>
                    <p>{el.name}</p>
                    <span>{el.category}</span>
                    <FavoriteIcon className='heart-ico' />
                </div>
              ))
              }
              </Carousel>
            </div>: 
               <div className='skeleton-product'>
                  {new Array(isMobile ? 3 : 4).fill(0).map(()=>(
                  <div style={{width : '100%'}}>
                    <Skeleton variant="rounded" width={'100%'} height={isMobile ? 200 : 380} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} width={isMobile ? 120 : 150} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={isMobile ? 50 : 100} />
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