import React,{useState,useEffect} from 'react'
import Sidebar from '../../../components/admin/AdminSidebar'
import { LineCharts } from '../../../components/admin/Charts'
import { getLastMonths } from '../../features'
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Skeleton } from '@mui/material';

const {last6Months} = getLastMonths();

const Line = () => {

  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [data, setData] = useState();

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
    if (user) {
      var decode = jwtDecode(user.token);
      if (decode.role !== "admin") {
        navigate("/");
      }
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER}/api/info/bar?id=${decode.id}`
        );
        const result = await res.json();

        if (result.sucess) {
          return setData(result.data);
        }
      } catch (err) {
        return err;
      }
    };
    fetchData();
  }, []);


  return (
    <div className='line'>
        <Sidebar/>
        <main className='line-container'>
        <h1 style={{marginBottom : "0px"}}>Line Charts</h1>
          <div className='line-chart'>
            {data ? <LineCharts
              data = {data.user}
              labels = {last6Months}
              bgColor="rgba(53, 162, 255,0.4)"
              borderColor='rgb(53,162,255)'
            />  :
            <Skeleton width={874} height={437} variant='rounded' />}
            <h2>Active Users</h2>
          </div>

          <div className='line-chart'>
            {data ? <LineCharts
              data = {data.products}
              labels = {last6Months}
              bgColor="hsla(29,80%,40%,0.4)"
              borderColor='hsl(29,80%,40%)'
            />  :
            <Skeleton width={874} height={437} variant='rounded' />}
            <h2>Total Product</h2>
          </div>
        </main>
    </div>
  )
}

export default Line