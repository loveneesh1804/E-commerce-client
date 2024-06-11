import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HeaderInfo from './HeaderInfo';

let time = 0;
const arr = ["Free Delivery","Sign Up & Get 15%-OFF","Payment Methods"];
const Header = () => {
  
  const [text,setText] = useState("Free Delivery");

  const [visible,setVisible] = useState(false);

  useEffect(()=>{
    const id = setInterval(()=>{
        if(time===arr.length){
            time = 0;
        }
        setText(arr[time]);
        time++;
      },4000)
    return ()=> clearInterval(id);
  },[text])
  return (
    <div className='header'>
        <div className='black-header'>
            <p className={visible ? 'head-rotate' : undefined} onClick={()=>setVisible(!visible)}><ExpandMoreIcon />{text}</p>
        </div>
        <HeaderInfo visible={{visible,setVisible}} />
    </div>
  )
}

export default Header