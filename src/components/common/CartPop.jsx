import React, { useState } from 'react';
import {useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
// import CloseIcon from '@mui/icons-material/Close';

const Cart = ({cart}) => {

  const cartData = useSelector(state=>state.cart);
  const navigate = useNavigate();
  const [hovered,setHovered] = useState();

  const closeModal=()=>{
    let id = setTimeout(()=>{
      !hovered && cart.setCart(false);

      return ()=>clearTimeout(id);
    }
    ,5000)
  }

  hovered ? cart.setCart(true) : closeModal();

  return (
    <div onClick={(e)=>e.target.className === "cart" && cart.setCart(false)} className='cart' style={{visibility : cart.cart ? "visible" : "hidden"}}>
        <div onMouseOver={()=>setHovered(true)} onMouseOut={()=>setHovered(false)} className={ cart.cart ? "main-cart slide-cart" : "main-cart"}>
            <div className='close-cart'>
                <h2>Cart Info</h2>
                {/* <CloseIcon onClick={()=>cart.setCart(false)} /> */}
            </div>
            {cartData && cartData.map(el=>(
              <div className='pop-up-item'>
              <div>
                <img crossOrigin='anyonmous' src={`${process.env.REACT_APP_SERVER}/${el.photo}`} alt="pop-up" />
              </div>
              <div>
                <p>{el.name}</p>
                <span>₹ {el.price}.00</span>
                <p>Size : {el.size}</p>
                <p>Quantity : {el.quantity}</p>
              </div>
            </div>
            ))
            }
            <div className='total-pop'>
              <p>Total</p>
              <strong>₹ {cartData.reduce((acc,el)=>acc+=el.price*el.quantity,0)}.00</strong>
            </div>
        </div>
        <div style={{right : cart.cart ? "0" : "-500px"}} className="go-to-cart">
          <button onClick={()=>navigate("/cart")}>View Bag {cartData.length && `(${cartData.reduce((acc,el)=>acc+=el.quantity,0)})`}</button>
        </div>
    </div>
  )
}

export default Cart