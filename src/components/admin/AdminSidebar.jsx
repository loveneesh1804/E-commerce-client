import React,{useEffect} from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useLocation, useNavigate } from "react-router-dom";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import TimerIcon from "@mui/icons-material/Timer";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useSelector} from "react-redux";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(state=>state.user.user);
  useEffect(()=>{
    if(user){
      const decode = jwtDecode(user.token);
      if(decode.role!=="admin"){
        navigate("/")
      }
    }else{
      navigate("/")
    }
  },[])

  return (
    <aside className="admin-sidebar">
      <h2 onClick={()=>navigate("/")}>
        Wisd<span style={{ color: "red" }}>Φ</span>m
      </h2>
      <div>
        <h5>Dashboard</h5>
        <ul>
          <li
            style={{
              color:
                location.pathname.includes("/admin/dashboard") && "#0073E1",
              backgroundColor:
                location.pathname.includes("/admin/dashboard") && "#0073e11a",
            }}
            onClick={() => navigate("/admin/dashboard")}
          >
            <DashboardIcon />
            Dashboard
          </li>
          <li
            style={{
              color: location.pathname.includes("/admin/products") && "#0073E1",
              backgroundColor:
                location.pathname.includes("/admin/products") && "#0073e11a",
            }}
            onClick={() => navigate("/admin/products")}
          >
            <LocalMallIcon />
            Products
          </li>
          <li
            style={{
              color:
                location.pathname.includes("/admin/transactions") && "#0073E1",
              backgroundColor:
                location.pathname.includes("/admin/transactions") &&
                "#0073e11a",
            }}
            onClick={() => navigate("/admin/transactions")}
          >
            <PriceChangeIcon />
            Transactions
          </li>
          <li
            style={{
              color: location.pathname.includes("/admin/users") && "#0073E1",
              backgroundColor:
                location.pathname.includes("/admin/users") && "#0073e11a",
            }}
            onClick={() => navigate("/admin/users")}
          >
            <AccountCircleIcon />
            Users
          </li>
        </ul>
      </div>
      <div>
        <h5>Charts</h5>
        <ul>
          <li
            style={{
              color: location.pathname.includes("/admin/bar") && "#0073E1",
              backgroundColor:
                location.pathname.includes("/admin/bar") && "#0073e11a",
            }}
            onClick={() => navigate("/admin/bar")}
          >
            <BarChartIcon />
            Bar
          </li>
          <li
            style={{
              color: location.pathname.includes("/admin/pie") && "#0073E1",
              backgroundColor:
                location.pathname.includes("/admin/pie") && "#0073e11a",
            }}
            onClick={() => navigate("/admin/pie")}
          >
            <PieChartIcon />
            Pie
          </li>
          <li
            style={{
              color: location.pathname.includes("/admin/line") && "#0073E1",
              backgroundColor:
                location.pathname.includes("/admin/line") && "#0073e11a",
            }}
            onClick={() => navigate("/admin/line")}
          >
            <SsidChartIcon />
            Line
          </li>
        </ul>
      </div>
      <div>
        <h5>Apps</h5>
        <ul>
          <li
            style={{
              color:
                location.pathname.includes("/admin/stopwatch") && "#0073E1",
              backgroundColor:
                location.pathname.includes("/admin/stopwatch") && "#0073e11a",
            }}
            onClick={() => navigate("/admin/stopwatch")}
          >
            <TimerIcon />
            Stopwatch
          </li>
          <li
            style={{
              color: location.pathname.includes("/admin/coupon") && "#0073E1",
              backgroundColor:
                location.pathname.includes("/admin/coupon") && "#0073e11a",
            }}
            onClick={() => navigate("/admin/coupon")}
          >
            <LocalOfferIcon/>
            Coupon
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
