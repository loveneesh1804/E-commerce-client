import React,{useState,useEffect} from 'react'
import Sidebar from '../../../components/admin/AdminSidebar'
import { BarCharts } from '../../../components/admin/Charts';
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getLastMonths } from '../../features';
import { Skeleton } from '@mui/material';

const {last12Months,last6Months} = getLastMonths();


const Bar = () => {


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
    <div className='bar'>
        <Sidebar/>
        <main className='bar-container'>
        <h1>Bar Charts</h1>
          <div className='vertical-bar'>
          {data ? <BarCharts
              data1 = {data.products}
              data2= {data.orders}
              title1="Products"
              title2="Orders"
              bgColor1="rgb(32, 102, 168)"
              bgColor2='rgb(142, 193, 218)'
              labels={last6Months}
            />  :
            <Skeleton width={874} height={437} variant='rounded' />}
            <h2>Top Selling Products of last six month</h2>
          </div>
          <div className='horizontal-bar'>
            {data ? <BarCharts
                horizontal={true}
                data1 = {data.pastOrder}
                title1="Orders"
                title2={""}
                bgColor2={"white"}
                bgColor1="rgb(234, 128, 28)"
                labels={last12Months}
              />  :
              <Skeleton width={874} height={437} variant='rounded' />}
              <h2>Orders of last Twelve Months</h2>
          </div>
        </main>
    </div>
  )
}

export default Bar