import CloseIcon from "@mui/icons-material/Close";
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

const Mobile = ({ view }) => {
    const navigate = useNavigate();
    const location = useLocation();
  return (
    <div
      onClick={(e) =>
        e.target.className === "main-sidebar" &&
        view.setViewSide(!view.viewSide)
      }
      className="main-sidebar"
      style={{ visibility: view.viewSide ? "visible" : "hidden" }}
    >
      <div className={view.viewSide ? "sidebar show-side-bar" : "sidebar"}>
        <div className="sidebar-icon">
          <CloseIcon onClick={() => view.setViewSide(!view.viewSide)} />
        </div>
          <div className="sidebar-content">
            <ul>
                <h2>ADMIN PANEL</h2>
                <li
                    style={{
                    color:
                        location.pathname.includes("/admin/dashboard") && "#0073E1",
                    backgroundColor:
                        location.pathname.includes("/admin/dashboard") &&
                        "#0073e11a",
                    }}
                    onClick={() => navigate("/admin/dashboard")}
                >
                    <DashboardIcon />
                    <span>Dashboard</span>
                </li>
                <li
                    style={{
                    color:
                        location.pathname.includes("/admin/products") && "#0073E1",
                    backgroundColor:
                        location.pathname.includes("/admin/products") &&
                        "#0073e11a",
                    }}
                    onClick={() => navigate("/admin/products")}
                >
                    <LocalMallIcon />
                    <span>Products</span>
                </li>
                <li
                    style={{
                    color:
                        location.pathname.includes("/admin/transactions") &&
                        "#0073E1",
                    backgroundColor:
                        location.pathname.includes("/admin/transactions") &&
                        "#0073e11a",
                    }}
                    onClick={() => navigate("/admin/transactions")}
                >
                    <PriceChangeIcon />
                    <span>Transactions</span>
                </li>
                <li
                    style={{
                    color:
                        location.pathname.includes("/admin/users") && "#0073E1",
                    backgroundColor:
                        location.pathname.includes("/admin/users") && "#0073e11a",
                    }}
                    onClick={() => navigate("/admin/users")}
                >
                    <AccountCircleIcon />
                    <span>Users</span>
                </li>

                <li
            style={{
              color: location.pathname.includes("/admin/bar") && "#0073E1",
              backgroundColor:
                location.pathname.includes("/admin/bar") && "#0073e11a",
            }}
            onClick={() => navigate("/admin/bar")}
          >
            <BarChartIcon />
            <span>Bar</span>
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
                    <span>Pie</span>
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
                    <span>Line</span>
                </li>

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
                    <span>Stopwatch</span>
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
                    <span>Coupon</span>
                </li>
            </ul>
          </div>
      </div>
    </div>
  );
};

export default Mobile;
