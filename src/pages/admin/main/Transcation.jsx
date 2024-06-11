import React, { useEffect,useState } from "react";
import Sidebar from "../../../components/admin/AdminSidebar";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { Skeleton } from "@mui/material";




const Transcation = () => {
  const navigate = useNavigate();
  const user = useSelector(state=>state.user.user);

  const [data,setData] = useState();
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    const fetchData=async()=>{
      try{
        if(user){
          var decode = jwtDecode(user.token);
        }
        const res = await fetch(`${process.env.REACT_APP_SERVER}/api/order/all?id=${decode.id}`);
        const result = await res.json();
  
        if(result.succes){
          setLoading(false);
          return setData(result.data);
        }else{
          setLoading(false);
        }
      }
      catch(e){
        return e;
      }
    }

    fetchData();
  },[])


  const handleManage = (el) =>{
    navigate(`/admin/transactions/${el._id}`);
  }
  return (
    <div className="admin-transactions">
      <Sidebar />
      <main className="product-dashboard ">
       <div>
         <h2>Transactions</h2>
       </div>
       <div>
        <table className="admin-product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data && !loading ? data.map((el, i) => (
              <tr key={i}>
                <td>{el.name}</td>
                <td>₹ {el.total}.00</td>
                <td>{el.orderInfo.reduce((acc,el)=>acc+= el.quantity,0)}</td>
                <td
                  style={{
                    color:
                      el.status === "Delivered"
                        ? "green"
                        : el.status === "Shipped"
                        ? "purple"
                        : el.status === "Processing"
                        ? "orange"
                        : el.status === "Cancelled" 
                        ? "red" : 'black',
                  }}
                >
                  {el.status}
                </td>
                <td>
                  <button onClick={()=>handleManage(el)}>Manage</button>
                </td>
              </tr>
            )) : !data && !loading ? <tr style={{color : "red",fontWeight:"600"}}>
              <td>No</td>
              <td>Transactions</td>
              <td>is</td>
              <td>in</td>
              <td>Progress!</td>
            </tr>: new Array(5).fill(0).map((el,i)=>(
              <tr className="user-table-skeleton" key={i}>
                <td><Skeleton variant="reactangular" width={80} height={10} /></td>
                <td><Skeleton variant="reactangular" width={80} height={10} /></td>
                <td><Skeleton variant="reactangular" width={50} height={10} /></td>
                <td><Skeleton variant="reactangular" width={140} height={10} /></td>
                <td><Skeleton variant="reactangular" width={50} height={10} /></td>
              </tr>
            ))}
          </tbody>
          
        </table>
        <div className="pagination">
            <button>
              <NavigateBeforeIcon />
              Prev
            </button>
            <span>1 of 3</span>
            <button>
              Next
              <NavigateNextIcon />
            </button>
        </div>
       </div>
      </main>  
    </div>
  );
};

export default Transcation;
