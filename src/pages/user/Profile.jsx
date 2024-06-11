import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Loader from "../../components/utils/Loader";
import { toast } from "react-hot-toast";
import { logout } from "../../redux/user/action";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import WidgetsIcon from "@mui/icons-material/Widgets";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import CloseIcon from "@mui/icons-material/Close";


const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [details, setDetails] = useState();
  const [modal, setModal] = useState();
  const [pop,setPop] = useState();
  const dispatch = useDispatch();

  const[name,setName] = useState();
  const [dob,setDob] = useState();
  const [showPhoto,setShowPhoto] = useState();
  const [photo,setPhoto] = useState();

  const [showDel,setDel] = useState();
  const [confirm,setConfrim] = useState();

  if (user) {
    var decode = jwtDecode(user.token);
  }
  if (details) {
    var [message, colorIco] = details.photo.split(" ");
  }

  const colorData = [
    "rgb(123,36,28)",
    "rgb(243,156,18)",
    "rgb(211,84,0)",
    "#2962FD",
    "#E6331A",
    "#2196F3",
    "#00BCD4",
    "#E6631A",
  ];

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER}/api/user/${decode.id}`,
          {
            headers: {
              "Content-type": "application/json",
              Authorization: user.token,
            },
          }
        );
        const result = await res.json();

        if (result.sucess) {
          setName(result.data.name);
          setDob(result.data.dob);
          return setDetails(result.data);
        }
        if (result.message === "jwt expired") {
          return dispatch(logout);
        }
      } catch (e) {
        return toast.error(e.message);
      }
    }
    fetchData();
  }, []);

  const handleImage=(e)=>{
    const file = e.target.files?.[0];
    setPhoto(e.target.files?.[0])

    const reader = new FileReader();
    if(file){
        reader.readAsDataURL(file);
        reader.onloadend = ()=>{
            if(typeof reader.result==="string") setShowPhoto(reader.result);
        }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(photo)

    if(!name && !dob && !photo){
      return toast.error("Nothing to Update!");
    }
    if(name === details.name && dob === details.dob && !photo){
      return toast.error("Similar to Previous Data!")
    }
    else{
      setPop(true);
    }
  };


const updateApi=()=>{

  const formData = new FormData();
  if(name) formData.set("name",name);
  if(photo) formData.set("photo",photo);
  if(dob) formData.set("dob",dob.split("T")[0].toString());


  async function updateData(){
      try{
        
          const res = await fetch(`${process.env.REACT_APP_SERVER}/api/user/${details._id}`,{
              method : "PUT",
              body : formData
          });
          const result = await res.json();

          if(result.success){
              toast.success("Updated Successfully!");
              let id = setTimeout(()=>{
                window.location.reload(true);
                return ()=> clearTimeout(id)
              },1000);
              setPop(false);
              return setModal(false);
              // return navigate(`/user/${details._id}`)
          }
      }
      catch(e){
          return toast.error("Something Went Wrong!");
      }
  }
  updateData();
}

const deletePhoto=()=>{
  async function handleDel(){
    try{
      var rand = Math.floor(Math.random() * colorData.length);
      var color = colorData[rand];
      const res = await fetch(`${process.env.REACT_APP_SERVER}/api/user/photo/${details._id}`,{
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          photo : `null ${color}`
        })
    });
    const result = await res.json();
  
  
    if(result.success){
      toast.success("Profile Photo Removed!")
      let id = setTimeout(()=>{
        window.location.reload(true);
        return ()=> clearTimeout(id)
      },1000);
      setConfrim(false);
      setPop(false);
      return setModal(false);
    }
    }
    catch(err){
      return err;
    }
  }
  handleDel();
}



  return details ? (
    <>
      <Header />
      <Navbar />
      {modal ? (
        <section className="user-update-section">
          <div className="user-update-content">
            <div className="user-photo">
              {message === "null" && !showPhoto ? (
                <div style={{ backgroundColor: `${colorIco}` }}>
                  {details.name.split(" ")[0].split("")[0].toUpperCase()}
                </div>
              ) : !showPhoto ? (
                <img style={{width : "150px", height : "150px"}}
                onMouseLeave={()=>setDel(false)}
                onMouseEnter={()=>setDel(true)}
                className="logo-update-form"
                crossOrigin="anonymous"
                src={`${process.env.REACT_APP_SERVER}/${details.photo}`} alt="abc" />
              ) : <img 
                  style={{width : "150px", height : "150px"}}
                  className="logo-update-form"
                  crossOrigin="anonymous"
                  src={showPhoto} alt="upload" 
                  />
              }
              <div onClick={()=>{setPop(true)
              setConfrim(true)}} style={{visibility : showDel ? "visible" : 'hidden'}} onMouseLeave={()=>setDel(false)}
                onMouseEnter={()=>setDel(true)} className="remove-photo"><span>Remove</span>
                </div>
            </div>

            <div className="update-from">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    onChange={(e)=>setName(e.target.value)}
                    name="name"
                    placeholder="Enter Name to Update"
                    value={name}
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" value={dob} onChange={e=>setDob(e.target.value)} name="dob" />
                </div>
                <div className="form-group">
                  <label>Photo</label>
                  <input type="file" onChange={handleImage} name="photo" />
                </div>
                <button type="submit">Update</button>
              </form>
            </div>
            <CloseIcon onClick={() => {setModal(false)
            setConfrim(false)}} className="user-close" />
          </div>
        </section>
      ) : (
        <section className="user-profile">
          <div className="user-content">
            <h1>{details.name}</h1>
            <div>
              <span>Username</span>
              <p>{details.username}</p>
            </div>
            <div>
              <span>Date of Birth</span>
              <p>{details.dob.split("T")[0]}</p>
            </div>
            <div>
              <span>Gender</span>
              <p>{details.gender}</p>
            </div>
            <div>
              <span>Joined Us</span>
              <p>{details.createdAt.split("T")[0]}</p>
            </div>

            <ModeEditOutlineIcon
              onClick={() => setModal(true)}
              className="edit-user-ico"
            />

            <div className="user-profile-button">
              {decode.role === "admin" ? (
                <>
                  <button onClick={() => navigate("/admin/dashboard")}>
                    <AdminPanelSettingsIcon />
                    Admin
                  </button>
                  <button>
                    <Diversity2Icon />
                    Help Others
                  </button>
                </>
              ) : (
                <>
                  <button>
                    <WidgetsIcon />
                    My Orders
                  </button>
                  <button>
                    <HeadsetMicIcon />
                    Help Center
                  </button>
                </>
              )}
            </div>
          </div>
          {message === "null" ? (
            <div
              style={{ backgroundColor: `${colorIco}` }}
              className="user-logo-2"
            >
              {details.name.split(" ")[0].split("")[0].toUpperCase()}
            </div>
          ) : (
            <img
              className="main-logo-user"
              style={{width : "150px", height : "150px"}}
              crossOrigin="anonymous"
              src={`${process.env.REACT_APP_SERVER}/${details.photo}`}
              alt="abc"
            />
          )}
        </section>
      )}


      {details && <div className="update-modal"
        onClick={(e)=>{e.target.className==="update-modal" && setPop(false)
        e.target.className==="update-modal" && setConfrim(false)
      }}
         style={{visibility : pop ? "visible" : "hidden",backgroundColor : "rgba(0,0,0,0.5)"}}>
            <div className="update-modal-box" style={{left : pop ? "50%" : "-50%"}}>
                <div>
                    <div>
                        <h3>{confirm ? "Delete Profile Photo" : "Update Account Info"}</h3>
                        <p>{ confirm ? "Are you sure, you want to delete your photo ?" : "Are you sure, you want to update your Details ?"}</p>
                    </div>
                    <div>
                        {confirm ? <button onClick={deletePhoto} style={{backgroundColor : "red"}} >Delete</button> : <button onClick={updateApi}>Update</button>}
                        <button onClick={()=>{setPop(false)
                        setConfrim(false)}}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>}

      <Footer />
    </>
  ) : (
    <Loader />
  );
};

export default Profile;
