import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/admin/AdminSidebar";
import add from "../../../assets/logo/add.png";
import Product from "../../../components/admin/ProductNew";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ImageModal from "../../../components/utils/ImageModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { Skeleton } from "@mui/material";

const Products = () => {
  const [modal, setModal] = useState(false);
  const [view, setView] = useState(false);
  const navigate = useNavigate();

  const admin = useSelector((state) => state.user.user);
  const [data, setData] = useState();
  const [loading,setLoading] = useState(true);


  useEffect(() => {
    if (admin) {
      var decode = jwtDecode(admin.token);
    }
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER}/api/product/all?id=${decode.id}`
        );
        const response = await res.json();
        if (response.success) {
          setLoading(false);
          return setData(response.data);
        }
        else{
          setLoading(false);
        }
      } catch (err) {
        return toast.error(err);
      }
    }
    fetchData();
  }, []);

  const handleImageModal = (el) => {
    localStorage.setItem("image-modal", el.photo);
    setModal(true);
  };
  const handleManage = (el) => {
    navigate(`/admin/products/${el._id}`);
  };
  return (
    <div className="admin-products">
      <Sidebar />
      <main className="product-dashboard">
        <div>
          <h2>Products</h2>
          <img onClick={() => setView(true)} src={add} alt="logo" />
        </div>
        <div className="tab-pro">
          <table className="admin-product-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data && !loading
                ? data.map(el => (
                    <tr key={el._id}>
                      <td>
                        <img
                          crossOrigin="anonymous"
                          onClick={() => handleImageModal(el)}
                          src={`${process.env.REACT_APP_SERVER}/${el.photo}`}
                          alt="logo"
                        />
                      </td>
                      <td>{el.name}</td>
                      <td>₹{el.price}</td>
                      <td style={{ color: el.stock <= 0 ? "red" : "green"}}>
                        {el.stock <= 0 ? "Out of Stock" : el.stock}
                      </td>
                      <td>
                        <button onClick={() => handleManage(el)}>Manage</button>
                      </td>
                    </tr>
                  ))
                  : !data && !loading ? <tr>
                      <td>Product</td>
                      <td>inventory</td>
                      <td>is</td>
                      <td>currently</td>
                      <td>empty!</td>
                  </tr> : new Array(5).fill(0).map((el,i)=>(
                    <tr className="user-table-skeleton" key={i}>
                      <td><Skeleton variant="reactangular" width={60} height={90} /></td>
                      <td><Skeleton variant="reactangular" width={160} height={10} /></td>
                      <td><Skeleton variant="reactangular" width={80} height={10} /></td>
                      <td><Skeleton variant="reactangular" width={30} height={10} /></td>
                      <td><Skeleton variant="reactangular" width={60} height={10} /></td>
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
      <Product view={view} setView={setView} />
      <ImageModal modal={modal} setModal={setModal} />
    </div>
  );
};

export default Products;
