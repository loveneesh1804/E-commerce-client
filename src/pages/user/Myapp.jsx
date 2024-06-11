import React, { useEffect, useState } from 'react';
import Navbar from "../../components/common/Navbar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Sidebar from '../../components/user/Sidebar';

const formatTime = (timeInSeconds)=>{
  const hr = Math.floor(timeInSeconds/3600) ;
  const min = Math.floor((timeInSeconds%3600)/60) ;
  const sec = timeInSeconds % 60;

  const hrStr = hr.toString().padStart(2,"0");
  const minStr = min.toString().padStart(2,"0");
  const secStr = sec.toString().padStart(2,"0");


  return `${hrStr}:${minStr}:${secStr}`;
}


const Myapp = () => {

  const [time,setTime] = useState(0);
  const [running,setRunning] = useState(false);

  useEffect(()=>{
    let id;
    if(running){
      id = setInterval(()=>{
        setTime(prev=>prev+1)
      },1000);
    }
    return ()=>{
      clearInterval(id);
    }
  },[running])


  return (
    <>
    <Header />
    <Navbar />
    <section className="my">
        <Sidebar />
        <main className="user-acc-details">
            <h3>Stop Watch</h3>
            <div className="user-stopwatch">
              <h1>{formatTime(time)}</h1>
              <div>
                <button className='st' onClick={()=> setRunning(prev => !prev)}>{running ? "Stop" : "Start"}</button>
                <button className='rs' onClick={()=>{
                  setTime(0);
                  setRunning(false);
                }}>Reset</button>
              </div>
            </div>
          </main>
    </section>
    <Footer />
    </>
  )
}

export default Myapp