import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/admin/AdminSidebar";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ImageModal from "../../../components/utils/ImageModal";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { Skeleton } from "@mui/material";


const Users = () => {
  const [delView, setDelView] = useState(false);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState();

  const [userDel,setUserDel] = useState();

  const admin = useSelector((state) => state.user.user);
  if (admin) {
    var decode = jwtDecode(admin.token);
  }

  const handleDelete = (name,id) => {
    setUserDel({name,id});
    setDelView(true);
  };
  const handleImage = (el) => {
    localStorage.setItem("image-modal", `${process.env.REACT_APP_SERVER}/${el}`);
    setModal(true);
  };

  const confirmDelete = async()=>{
    try{
      console.log(`${process.env.REACT_APP_SERVER}/api/user/${userDel.id}?id=${decode.id}`);
      const res = await fetch(`${process.env.REACT_APP_SERVER}/api/user/${userDel.id}?id=${decode.id}`,{
        method : "DELETE"
      });
      const result = await res.json();
      if(result.sucess){
        setDelView(false);
        toast.success("User Deleted Successfully");
        let id = setTimeout(()=>{
          window.location.reload(true);
          return ()=>clearTimeout(id);
        },1000)
      }

    }
    catch(err){
      return err;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER}/api/user/all?id=${decode.id}`
        );
        const result = await res.json();
        if (result.sucess) {
          return setData(result.data);
        } else {
          return toast.error("Something Went Wrong!");
        }
      } catch (e) {
        return e;
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-users">
      <ImageModal modal={modal} setModal={setModal} />
      <Sidebar />
      <main className="product-dashboard ">
        <div>
          <h2>Users</h2>
        </div>
        <div>
          <table className="admin-product-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data ?
                data.map((el, i) => (
                  <tr key={i}>
                    {el.photo.split(" ")[0] === "null" ? (
                      <td>
                        <span style={{backgroundColor : `${el.photo.split(" ")[1]}`}} className="admin-user-ico" >{el.name[0].toUpperCase()}</span>
                      </td>
                    ) : (
                      <td
                        onClick={() => handleImage(el.photo)}
                        className="avatar"
                      >
                        <img
                          crossOrigin="anonymous"
                          style={{ width: "50px", height: "50px" }}
                          src={`${process.env.REACT_APP_SERVER}/${el.photo}`}
                          alt="avatar"
                        />
                      </td>
                    )}
                    <td>{el.name}</td>
                    <td>{el.gender}</td>
                    <td>{el.username}</td>
                    <td>{el.role}</td>
                    <td
                      onClick={() => handleDelete(el.name,el._id)}
                      className="user-delete"
                    >
                      <DeleteIcon />
                    </td>
                  </tr>
                )): new Array(5).fill(0).map((el,i)=>(
                  <tr className="user-table-skeleton" key={i}>
                    <td><Skeleton variant="circular" width={50} height={50} /></td>
                    <td><Skeleton variant="reactangular" width={80} height={10} /></td>
                    <td><Skeleton variant="reactangular" width={50} height={10} /></td>
                    <td><Skeleton variant="reactangular" width={120} height={10} /></td>
                    <td><Skeleton variant="reactangular" width={50} height={10} /></td>
                    <td><Skeleton variant="circular" width={20} height={20} /></td>
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


      {/* modal */}

      {userDel && <div onClick={(e)=>e.target.className==="delete-modal" && setDelView(false)} style={{visibility : delView ? "visible" : 'hidden' }} className='delete-modal'>
        <div className={ delView ?'main-delete up-pop' :'main-delete'}>
            <div className='del-message'>
                <WarningAmberIcon />
                <div>
                    <h4>Delete User</h4>
                    <span>Are you sure you want to delete user {userDel.name} ?</span>
                </div>
            </div>
            <div className="del-confirm">
                <button onClick={()=>setDelView(false)} >Cancel</button>
                <button onClick={confirmDelete}>Delete</button>
            </div>
        </div>
      </div>
      }

    </div>
  );
};

export default Users;
