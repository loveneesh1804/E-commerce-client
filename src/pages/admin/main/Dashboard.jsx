import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/admin/AdminSidebar";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { BarCharts, DoughnutChart } from "../../../components/admin/Charts";
import WcIcon from "@mui/icons-material/Wc";
import Table from "../../../components/admin/DashBoardTable";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLastMonths } from "../../features";
import { Skeleton } from "@mui/material";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  var decode = jwtDecode(user.token);
  const navigate = useNavigate();

  const {last6Months} = getLastMonths();

  const [data, setData] = useState();

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
    if (user) {
      if (decode.role !== "admin") {
        navigate("/");
      }
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER}/api/info/dashboard?id=${decode.id}`
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
    <div className="admin-dashboard">
      <Sidebar />
      <main className="dashboard">
        <div className="dashboard-search">
          <SearchIcon />
          <input type="text" placeholder="Search for data, users, products" />
          <NotificationsNoneIcon />
          {user ? <span
                  style={{ background: `${decode.photo.split(" ")[1]}` }}
                  onClick={() => navigate(`/my/${decode.id}`)}
                  className="user-logo"
                >
                  {decode.name[0].toUpperCase()}
                </span> : undefined}
        </div>

        <div className="widget-box">
          {data ? (
            <>
              <Widget
                heading="Revenue"
                amount={true}
                value={data.count.revenue}
                color="rgb(255, 87, 51 )"
                percentage={data.percentage.revenue}
              />
              <Widget
                heading="Users"
                value={data.count.user}
                color="rgb(125, 60, 152)"
                percentage={data.percentage.user}
              />
              <Widget
                heading="Transcations"
                value={data.count.order}
                color="rgb(241, 196, 15 )"
                percentage={data.percentage.order}
              />
              <Widget
                heading="Products"
                value={data.count.product}
                color="rgb(0, 115, 255)"
                percentage={data.percentage.product}
              />
            </>
          ) : (
            <div className="widget-skeleton">
              {new Array(4).fill(0).map((el,i)=>(
                <article key={i} className="widget">
                  {/* <Skeleton variant="rounded" width={253} height={144} /> */}
                  <div>
                    <Skeleton variant="rounded" width={80} height={14} />
                    <Skeleton variant="rounded" width={130} height={24} />
                    <Skeleton variant="rounded" width={130} height={18} />
                  </div>
                  <div>
                    <Skeleton variant="circular" width={70} height={70} />
                  </div>
                </article>
            ))}
            </div>
          )}
        </div>

        <div className="admin-graph">
          <div className="revenue-chart">
            <h2>Revenue & Transactions</h2>
            {data ? (
              <BarCharts
                bgColor1="rgb(0, 115, 255)"
                bgColor2="rgba(53,162,235,0.8)"
                data1={data.chart.revenue}
                data2={data.chart.order}
                title1="Revenue"
                title2="Transactions"
                labels={last6Months}
              />
            ) : (
              <div>
                  <Skeleton width={750} height={400} variant="rounded" />
              </div>
            )}
          </div>
          <div className="inventory">
            <h2>Inventory</h2>
            {data ? (
              data.categories.map((el) => {
                const [heading,value] = Object.entries(el)[0];
                return (<Inventory key={heading} value={value} heading={heading} />)
              })
            ) : (
              <div>
                {new Array(7).fill(0).map((el,i)=>(
                  <div key={i} className="inventory-skeleton">
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="text" sx={{ fontSize: '0.7rem' }} width={140} />
                    <Skeleton variant="circular" width={30} height={30} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="admin-table">
          <div className="gender-chart">
            <h2>Gender Ratio</h2>
            {data ? (
              <>
                <DoughnutChart
                cutout={75}
                labels={["Male", "Female"]}
                data={[data.userRatio.male, data.userRatio.female]}
                bgColor={["rgb(155, 89, 182)", "rgb(52, 152, 219) "]}
              />
              <p>
                <WcIcon />
              </p>
              </>
            ) : (
              <div className="pie-load">
                <Skeleton variant="circular" width={235} height={235} />
                <div className="pie-skeleton">
                    <Skeleton variant="rectangular" width={50} height={20} />
                    <Skeleton variant="rectangular" width={50} height={20} />
                </div>
              </div>
            )}
            
          </div>
          {data ? <Table data={data.latestTransaction} /> : <div className="skeleton-table">
            <h2>LATEST TRANSACTIONS</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {new Array(4).fill(0).map((el,i)=>(
                  <tr key={i}>
                  <td><Skeleton variant="rounded" width={180} height={20} /></td>
                  <td><Skeleton variant="rounded" width={50} height={20} /></td>
                  <td><Skeleton variant="rounded" width={50} height={20} /></td>
                  <td><Skeleton variant="rounded" width={80} height={20} /></td>
                </tr>
                ))}
              </tbody>
            </table>
            
          </div>
          
          }
        </div>
      </main>
    </div>
  );
};

const Widget = ({ heading, value, percentage, color, amount }) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value}` : `${value}`}</h4>
      {percentage > 0 ? (
        <span className="green">
          <TrendingUpIcon /> +{percentage}%
        </span>
      ) : (
        <span className="red">
          <TrendingDownIcon />
          {percentage}%
        </span>
      )}
    </div>
    <div
      className="widget-progress"
      style={{
        background: `conic-gradient(${color} ${
          (Math.abs(percentage) / 100) * 360
        }deg,rgb(255,255,255) 0)`,
      }}
    >
      <span style={{ color }}>
        {percentage > 10000
          ? percentage.toString().slice(0, 3) + ".."
          : percentage}
        %
      </span>
    </div>
  </article>
);

const Inventory = ({ color, value, heading }) => {
  const colorData = [
    "rgb(123,36,28)", 
  "rgb(148,49,38)",
  "rgb(99,57,116)",
  "rgb(91,44,111)",
  "rgb(26,82,118)",
  "rgb(33,97,140)",
  "rgb(14,102,85)",
  "rgb(243,156,18)",
  "rgb(211,84,0)",
  "#2962FD",
  "#E6331A",
  "#2196F3",
  "#00BCD4",
  "#E6631A",
  "rgb(46,204,113)",
  "rgb(52,152,219)",
  "rgb(46,134,193)",
  "rgb(230,126,34)"
  ];
  const num = Math.floor(Math.random()*colorData.length);
  return (
    <div className="inventory-item">
      <h5>{heading}</h5>
      <div>
        <div style={{ backgroundColor: `${colorData[num]}`, width: `${value}%` }}></div>
      </div>
      <span>{value}%</span>
    </div>
  )
};

export default Dashboard;
