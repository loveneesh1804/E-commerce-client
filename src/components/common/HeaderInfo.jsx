import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

const HeaderInfo = ({visible}) => {
  return (
    <div onClick={(e)=>e.target.className==="main-header-info" && visible.setVisible(!visible.visible) } className='main-header-info' style={{visibility : visible.visible ? "visible" : "hidden"}}>
        <div className =  { visible.visible ?  'header-info slide' :  'header-info'}>
        <div>
            <h2>SIGN UP & GET 15% OFF</h2>
            <p>Members get more! Like a 15% discount voucher, early access to the sale and access to limited edition products. Sign up now!</p>
        </div>
        <div>
            <h2>Free Delivery</h2>
            <p>Spend over Rs1000/- and your delivery is FREE!
            For all orders, Return & Exchange is offered for free.
            Delivery times for Metro Cities: 2-3 Days Others: 4-5 Days</p>
        </div>
        <div>
            <h2>UPI & NET BANKING AVAILABLE</h2>
        </div>
        <CloseIcon onClick={()=>visible.setVisible(!visible.visible)}/>
    </div>
    </div>
  )
}

export default HeaderInfo