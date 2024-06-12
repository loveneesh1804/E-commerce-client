import React, { useState } from 'react';
import Header from "../../components/common/Header";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import HelpIcon from '@mui/icons-material/Help';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { cartQty, removeCart} from "../../redux/cart/action";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { checkout } from '../../redux/order/action';


const Cart = () => {
    const cart = useSelector(state=>state.cart);
    const user = useSelector(state=>state.user.user);


    const dispatch = useDispatch();
    const navigate= useNavigate();

    const [coupon,setCoupon] = useState();
    const [discount,setDiscount] = useState();

    const handleRemove=(i)=>{
        toast.success("Removed From Cart!")
        dispatch(removeCart(i))
    }

    if(cart){
        var totalAmount = cart.reduce((acc,el)=>acc+=el.price*el.quantity,0);
        var shipping;

        if(totalAmount>2500){
            shipping = "Free";
        }
        else{
            shipping = 750;
        }

        if(discount){
            var discountAmount;
            if(shipping===750){
                discountAmount = ~~(((totalAmount + shipping )* discount) / 100);
                totalAmount = totalAmount + shipping - discountAmount ;
            }else{
                discountAmount = ~~((totalAmount * discount) / 100);
                totalAmount -= discountAmount ;
            }
        }
        
        
    }

    const handleCoupon=()=>{
        if(!user){
            return toast.error("Login to Apply Code")
        }
        if(!coupon){
            return toast.error("Enter Prome Code")
        }
        const validCoupon =async()=>{
            try{
                const res = await fetch(`${process.env.REACT_APP_SERVER}/api/payment/coupon/apply?coupon=${coupon}`,{
                    headers : {
                        "Content-Type" : "application/json"
                    }
                });

                const result = await res.json();
                if(result.success){
                    setDiscount(result.discount);
                    return toast.success("Coupon Applied!");
                }
                else{
                    return toast.error("Invalid Coupon")
                }
            }
            catch(e){
                return e;
            }
        }
        validCoupon();
    }

    const handleQty=(el,e)=>{
        let totalQty = 0;

        cart.forEach(item=>{
        if(item._id===el._id){
            totalQty += item.quantity;
        }
        })

        var newQty = Math.abs(+(e.target.value)-el.quantity);

        if(+e.target.value>el.quantity){
            if(+(e.target.value)>el.stock || totalQty+newQty>el.stock ){
                return toast.error(`Only ${el.stock} left in Stock!`);
            }
        }
        else{
            if(+(e.target.value)>el.stock || totalQty-newQty>el.stock ){
                return toast.error(`Only ${el.stock} left in Stock!`);
            }
        }
       return dispatch(cartQty({product : el,qty : +(e.target.value)}))
    }

    const handleCheckout=()=>{
        if(!user){
            return toast.error("Login to Continue!")
        }
       if(cart.length){
        const payload = {
            discount : discount ? discountAmount : 0,
            total : totalAmount,
            shipping,
            subtotal : cart.reduce((acc,el)=>acc+=el.price*el.quantity,0),
            tax : shipping===750 ? ((totalAmount+shipping) * 18 ) / 100 : (totalAmount*18)/100,
            orderInfo : cart,
           }
           dispatch(checkout(payload));
           navigate("/checkout");
       }
    }
  return (
    <>
        <Header />
        <Navbar />
        <section className="bag-box">
            <div className="bag">
                <h2>Bag</h2>
                <div className="bag-item-box">
                    {cart.length ? cart.map((el,i)=>(
                        <div key={i} className="bag-item">
                        <div>
                            <img onClick={()=>navigate(`/shop/${el._id}`)} crossOrigin='anyonmous' src={el.photo} alt="bag" />
                        </div>
                        <div className='content-item'>
                            <div className="name">
                                <strong>{el.name.toUpperCase()}</strong>
                                <b>₹ {el.price}.00</b>
                            </div>
                            <span>{el.category}</span>
                            <div className='selection-tab'>
                                <div>
                                    <span>Size</span>
                                    <span>{el.size}</span>
                                </div>
                                <div>
                                    <span>Quantity</span>
                                    <select value={el.quantity} onChange={(e)=>handleQty(el,e)} >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <FavoriteBorderOutlinedIcon />
                                <DeleteOutlineOutlinedIcon onClick={()=>handleRemove(i)} />
                            </div>
                        </div>
                        </div>
                    )): 
                    <h1 className='empty-bag'>Your Bag is Empty!</h1>
                    }
                    


                    <div className="join-us">
                        <h2>Favourites</h2>
                        <span>Want to view your favourites? <span><u>Join us</u></span> or <span><u>Sign in</u></span></span>
                    </div>
                </div>
            </div>

            <div className="summary-bag">
                <h2>Summary</h2>
                <div className="subtotal">
                    <p>Subtotal
                        <HelpIcon />
                    </p>
                    <span>₹ {cart && cart.reduce((acc,el)=>acc+=el.price*el.quantity,0)}.00</span>
                </div>
                <div>
                    <p> Estimated Delivery & Handling</p>
                    <span>{typeof shipping === "number" ? `₹ ${shipping}.00` : shipping}</span>
                </div>
                {discount ? <div>
                    <p>Discount</p>
                    <span style={{color : "red"}}>- ₹ {discountAmount}.00</span>
                </div> : undefined}
                <div>
                    <p> Total</p>
                    <strong>₹ {totalAmount}.00</strong>
                </div>
                {cart.length ? <button onClick={handleCheckout} >Checkout</button> : <button onClick={()=>navigate("/shop")} >Shop Now</button>}
                {cart.length ? <><h2>Coupon</h2>
                <div className="coupon-cart">
                    <div>
                        <span>Do you have a Promo Code?</span>
                    </div>
                    <div>
                        <input value={coupon} onChange={(e)=>setCoupon(e.target.value)} type="text" />
                        <button onClick={handleCoupon}>Apply</button>
                    </div>
                </div></> : undefined}
            </div>
        </section>
        <Footer />
    </>
  )
}

export default Cart