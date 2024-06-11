import React, { useEffect, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import model1 from "../../assets/banner/model1.jpeg";
import model2 from "../../assets/banner/model2.jpg";
import model3 from "../../assets/banner/model3.png";


  
let i=1;
const Banner = () => {
  const [right,setRight] = useState(0);
  const [count,setCount] = useState(0);

  useEffect(()=>{
    let id = setInterval(()=>{
      if(i===1){
        setRight(120);
        setCount(40);
      }
      else if(i===2){
        setRight(prev=>prev+120);
        setCount(prev=>prev+40);
      }
      else if(i===3){
        setRight(0);
        setCount(0);
      }
      if(i===4) i=1;
      else i++;
    },8000)
    return ()=>clearInterval(id);
  },[right])

  return (
   <>
    <div className="main-banner">
        <div className="banner-carousel">
          <div style={{right : `${right}vh`}} className='banner-box'>
            <div className="banner">
              <img src={model1} alt="model" />
              <div className="banner-content">
                <h1>HAND <span style={{color:"red"}}>CRAFTED</span></h1>
                <span>Exclusive Collection!</span>
                <button>Shop Now<ArrowForwardIosIcon /></button>
              </div>
            </div>
            <div className="banner">
              <img src={model2} alt="model" />
              <div className='banner-content'>
                <h1>New<span style={{color : "red"}}> Arrival</span></h1>
                <span>Summer Neutrals</span>
                <button>Shop Now<ArrowForwardIosIcon /></button>
              </div >
            </div>
            <div className="banner">
              <img src={model3} alt="model" />
              <div className="bannerImg">
                  <p>End of season SALE!</p>
                  <h3>Up to 50% off</h3>
                  <p style={{marginTop : "-10px"}}>Shop from 10,000+ styles</p>
                  <div className="buttons">
                      <button>Ladies</button>
                      <button>Men</button>
                      <button>Divided</button>
                      <button>Kids</button>
                      <button>Baby</button>
                      <button>Home</button>
                      <button>Sports</button>
                      <p>Available on wisdom.com, app & in stores, price may vary.</p>
                  </div>
              </div>
            </div>
          </div>  
        </div>
    </div>
    <div className="carousel-scroll">
      <div style={{left : `${count}vh`}} className='scroller'></div>
    </div>
   </>
  )
}

export default Banner