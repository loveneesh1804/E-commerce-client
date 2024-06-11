import React from 'react';
import Header from '../../components/common/Header'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer';
import agreement from '../../assets/shop/agreement.png'

const Sell = () => {
  return (
    <>
        <Header />
        <Navbar />
        <section className="sell">
            <div className="sell-with-us">
                <h2>BECOME A WISDOM STORE SELLER!</h2>
                <div className="sell-box">
                    <form className="sell-form">
                            <div>
                                <label >Name</label>
                                <input type="text" placeholder='Your Full Name' />
                            </div>
                            <div>
                                <label >Email Address</label>
                                <input type="text" placeholder='Your Email Address' />
                            </div>
                            <div>
                                <label >Phone Number</label>
                                <input type="text" placeholder='Your Phone Number' />
                            </div>
                            <div>
                                <label >Brand</label>
                                <input type="text" placeholder='Your Bussiness Brand' />
                            </div>
                            <div className='last-sell'>
                                <label >Business</label>
                                <textarea rows={6} placeholder='Describe Your Business' ></textarea>
                            </div>
                            <button>Submit</button>
                    </form>
                    <div className="sell-banner">
                        <div>
                            <h2>Would you like to sell your products on WISDOM Store!</h2>
                            <span>Grow your business with MERN Store</span>
                            <p>Apply Today</p>
                        </div>
                        <img className='agreement' src={agreement} alt="agree" />
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </>
  )
}

export default Sell