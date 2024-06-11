import React,{useState,useEffect}  from "react";
import Sidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieCharts } from "../../../components/admin/Charts";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";



const Pie = () => {

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
          `${process.env.REACT_APP_SERVER}/api/info/pie?id=${decode.id}`
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

  const colorHandler=()=>{
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
    return colorData[num];
  }

  return (
    <div className="pie">
      <Sidebar />
      <main className="pie-container">
        <h1>Pie & Doughnut Charts</h1>
        <div className="pie-flex">
          <div>
            {data ? <PieCharts
              offset={[0, 0, 40]}
              labels={["Delivered", "Shipped", "Processing"]}
              data={[data.orderRatio.delivered, data.orderRatio.processed, data.orderRatio.shipped]}
              bgColor={[
                "rgb(133, 193, 233 )",
                "rgb(52, 152, 219 ) ",
                "rgb(40, 116, 166 )",
              ]}
            /> : <Skeleton variant="circular" height={382} width={382} />}
            <h2>Order Fulfillment ratio</h2>
          </div>
          <div>
            {data ? <DoughnutChart
              offset={[0, 0, 0, 80]}
              labels={data.categoryPercent.map(el=>Object.keys(el)[0])}
              data={data.categoryPercent.map(el=>Object.values(el)[0])}
              legends = {false}
              bgColor={new Array(data.categoryPercent.length).fill(0).map(()=>colorHandler())}
            /> : <Skeleton variant="circular" height={382} width={382} />}
            <h2>Product Categories ratio</h2>
          </div>
        </div>
        <div className="pie-flex">
          <div>
          {data ? <DoughnutChart
              offset={[0, 40]}
              labels={["In Stock","Out of Stock"]}
              data={[data.stockRatio.inStock, data.stockRatio.outOfStock]}
              legends = {true}
              bgColor={[
                "rgb(210, 180, 222  ) ",
                "rgb(125, 60, 152  )",
              ]}
              cutout={"10%"}
            /> : <Skeleton variant="circular" height={382} width={382} />}
            <h2 style={{marginTop : "10px"}}>Stock Availability</h2>
          </div>
          <div>
          {data ? <DoughnutChart
              offset={[20, 20,20,40]}
              labels={["Net Revenue","Burnt","Net Margin","Expenditure"]}
              data={[data.revenueDistribution.netRevenue,data.revenueDistribution.burnt,data.revenueDistribution.netIncome,data.revenueDistribution.expenditure,]}
              bgColor={[
                "rgb(52, 152, 219 ) ",
                "rgb(115, 198, 182 )",
                "rgb(250, 215, 160   )",
                "rgb(88, 214, 141 )"
              ]}
              cutout={"70%"}
              legends={false}
            /> : <Skeleton variant="circular" height={382} width={382} />}
            <h2>Revenue Distribution</h2>
          </div>
        </div>
        <div className="pie-flex">
          <div>
          {data ? <PieCharts
              offset={[0, 80, 40]}
              labels={["Teen", "Adult", "old"]}
              data={[data.ageGroup.teen,data.ageGroup.adult,data.ageGroup.old]}
              bgColor={[
                "rgb(215, 189, 226  )",
                "rgb(241, 148, 138) ",
                "rgb(220, 118, 51 )",
              ]}
            /> : <Skeleton variant="circular" height={382} width={382} />}
            <h2>User Age Group</h2>
          </div>
          <div>
          {data ? <DoughnutChart
              offset={[20,20]}
              cutout={"0%"}
              legends={true}
              labels={["Users","Admin"]}
              data={[data.userRatio.customer,data.userRatio.admin]}
              bgColor={[
                "rgb(40, 180, 99 ",
                "rgb(130, 224, 170  ) ",
              ]}
            /> : <Skeleton variant="circular" height={382} width={382} />}
            <h2 style={{marginTop : "20px"}}>Role Ratio</h2>
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default Pie;
