import React from 'react';
import facebook from "../../assets/social/facebook.png";
import instagram from "../../assets/social/instagram.png";
import pintrest from "../../assets/social/pintrest.png";
import youtube from "../../assets/social/youtube.png";
import twitter from "../../assets/social/twitter.png";

const Footer = () => {
  return (
    <>
      <div className='footer'>
          <div>
                  <h5>CUSTOMER SERVICE</h5>
                  <p>Contact Us</p>
                  <p>Sell With Us</p>
                  <p>Shipping</p>
          </div>
          <div>
                  <h5>LINKS</h5>
                  <p>Know More</p>
                  <p>About Wisdom</p>
                  <p>Help Center</p>
          </div>
          <div>
                <h5>NEWSLETTER</h5>
                <p>Sign Up for Our Newsletter</p>
                <div className='newsletter'><input placeholder='Please Enter Your Email' /><button>Subscribe</button></div>
          </div>
      </div>
      <p className='foot-info'>© 2024 Wisdom Store</p>
      <div className="foot-icon">
        <img src={facebook} alt="icon" />
        <img src={instagram} alt="icon" />
        <img src={pintrest} alt="icon" />
        <img src={twitter} alt="icon" />
        <img src={youtube} alt="icon" />
      </div>
    </>
    
  )
}

export default Footer