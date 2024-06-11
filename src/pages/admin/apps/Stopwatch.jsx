import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/admin/AdminSidebar';

const formatTime = (timeInSeconds)=>{
  const hr = Math.floor(timeInSeconds/3600) ;
  const min = Math.floor((timeInSeconds%3600)/60) ;
  const sec = timeInSeconds % 60;

  const hrStr = hr.toString().padStart(2,"0");
  const minStr = min.toString().padStart(2,"0");
  const secStr = sec.toString().padStart(2,"0");


  return `${hrStr}:${minStr}:${secStr}`;
}

const Stopwatch = () => {
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
    <div className='stopwatch'>
      <Sidebar />
      <main className='app-container'>
        <h1>Stopwatch </h1>
        <div className="stopwatch-main">
          <h1>{formatTime(time)}</h1>
          <button onClick={()=> setRunning(prev => !prev)} style={{backgroundColor:"rgb(0, 115, 255)"}}>{running ? "Stop" : "Start"}</button>
          <button onClick={()=>{
            setTime(0);
            setRunning(false);
          }}>Reset</button>
        </div>
      </main>
    </div>
  )
}

export default Stopwatch