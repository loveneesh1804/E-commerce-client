import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = ({view}) => {
  return (
    <div onClick={(e)=>e.target.className==="main-sidebar" && view.setViewSide(!view.viewSide)} className='main-sidebar' style={{visibility : view.viewSide ? "visible" : "hidden"}}>
        <div className={view.viewSide ? "sidebar show-side-bar" : "sidebar"}>
            <div className='sidebar-icon'>
                <CloseIcon onClick={()=>view.setViewSide(!view.viewSide)} />
            </div>
            <div className='sidebar-content'>
                <ul>
                    <h2>Shop By Category</h2>
                    <li><span>Footwear</span></li>
                    <li><span>Clothing</span></li>
                    <li><span>Accessories</span></li>
                    <li><span>Sports</span></li>
                    <li><span>Sustainable materials</span></li>
                    <li><span>Featured</span></li>
                    <li><span>T-Toes</span></li>
                    <li><span>Samba</span></li>
                    <li><span>Specials</span></li>
                    <li><span>Summer Shop</span></li>
                    <li><span>Hikking</span></li>
                    <li><span>Outdoor</span></li>
                    <li><span>wisdom Sportswear</span></li>
                    <li><span>Made with Recycled Materials</span></li>
                    <li style={{color : "#e32b2b",fontWeight : 800}}><span className='red'>Outlet</span></li>
                </ul>
                <ul>
                <h2>Clothing</h2>
                    <li><span>T-Shirts & Tank Tops</span></li>
                    <li><span>Hoodies</span></li>
                    <li><span>Jackets</span></li>
                    <li><span>Tracksuits</span></li>
                    <li><span>Sweatshirts</span></li>
                    <li><span>Joggers & Track Pants</span></li>
                    <li><span>Oriignals</span></li>
                    <li><span>Swimwear</span></li>
                    <li><span>Socks</span></li>
                    <li><span>Gloves</span></li>
                    <li><span>Headwear</span></li>
                    <li><span>Backpacks</span></li>
                    <li><span>Gym & Training</span></li>
                    <li><span>Face Covers</span></li>
                </ul>
                <ul>
                    <h2>All</h2>
                    <li><span>All Men's Footwear</span></li>
                    <li><span>All Men's Clothing</span></li>
                    <li><span>All Men's Accessories</span></li>
                    <li><span>Men's All Sustainable</span></li>
                    <li><span>All Women's Footwear</span></li>
                    <li><span>All Women's Clothing</span></li>
                    <li><span>All Women's Accessories</span></li>
                    <li><span>Women's All Sustainable</span></li>
                </ul>
                
            </div>
        </div>
    </div>
  )
}

export default Sidebar