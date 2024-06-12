import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Sidebar from "../../components/user/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { logout } from "../../redux/user/action";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Skeleton } from "@mui/material";

const My = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [details, setDetails] = useState();
  const [pop, setPop] = useState();
  const dispatch = useDispatch();

  const [name, setName] = useState();
  const [dob, setDob] = useState();
  const [phoneNo,setPhoneNo] = useState();
  const [showPhoto, setShowPhoto] = useState();
  const [photo, setPhoto] = useState();

  const [showDel, setDel] = useState();
  const [confirm, setConfrim] = useState();

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
          if(result.data.phoneNo!=="null"){
            setPhoneNo(result.data.phoneNo);
          }
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

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    setPhoto(e.target.files?.[0]);

    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") setShowPhoto(reader.result);
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(photo);

    if (!name && !dob && !photo && !phoneNo) {
      return toast.error("Nothing to Update!");
    }
    if (name === details.name && dob === details.dob && !photo && phoneNo=== details.phoneNo) {
      return toast.error("Similar to Previous Data!");
    } 
    if(phoneNo.length<10){
      return toast.error("Invalid Phone Number!")
    }
    else {
      setPop(true);
    }
  };

  const updateApi = () => {
    const formData = new FormData();
    if (name) formData.set("name", name);
    if (photo) formData.set("photo", photo);
    if (phoneNo) formData.set("phoneNo", phoneNo);
    if (dob) formData.set("dob", dob.split("T")[0].toString());

    async function updateData() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER}/api/user/${details._id}`,
          {
            method: "PUT",
            body: formData,
          }
        );
        const result = await res.json();

        if (result.success) {
          toast.success("Updated Successfully!");
          let id = setTimeout(() => {
            window.location.reload(true);
            return () => clearTimeout(id);
          }, 1000);
          return setPop(false);
        }
      } catch (e) {
        return toast.error("Something Went Wrong!");
      }
    }
    updateData();
  };

  const deletePhoto = () => {
    async function handleDel() {
      try {
        var rand = Math.floor(Math.random() * colorData.length);
        var color = colorData[rand];
        const res = await fetch(
          `${process.env.REACT_APP_SERVER}/api/user/photo/${details._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              photo: `null ${color}`,
            }),
          }
        );
        const result = await res.json();

        if (result.success) {
          toast.success("Profile Photo Removed!");
          let id = setTimeout(() => {
            window.location.reload(true);
            return () => clearTimeout(id);
          }, 1000);
          setConfrim(false);
          return setPop(false);
        }
      } catch (err) {
        return err;
      }
    }
    handleDel();
  };

  return (
    <>
      <Header />
      <Navbar />
      <section className="my">
        <Sidebar />
        {details ? (
          <main className="user-acc-details">
            <h3>Account Details</h3>
            <form className="update-form">
              <div>
                <span>{details.username}</span>
                {details.role === "admin" ? (
                  <button onClick={()=>navigate("/admin/dashboard")} >Admin</button>
                ) : (
                  <button onClick={()=>navigate(`/my/${details._id}`)} >Member</button>
                )}
                <span>Joined Us : {details.createdAt.split("T")[0]}</span>
              </div>
              <div>
                <div>
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Please Enter Your Name"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </div>
                  <div>
                    <label>Date of Birth</label>
                    <input
                      value={dob.split("T")[0]}
                      onChange={(e) => setDob(e.target.value)}
                      type="date"
                    />
                  </div>
                </div>

                <div className="main-update-photo">
                  <label>
                    <input
                      className="image-upload"
                      onChange={handleImage}
                      type="file"
                    />
                    <CameraAltIcon />
                  </label>
                  <div className="user-photo">
                      {message === "null" && !showPhoto ? (
                        <div style={{ backgroundColor: `${colorIco}` }}>
                          {details.name
                            .split(" ")[0]
                            .split("")[0]
                            .toUpperCase()}
                        </div>
                      ) : !showPhoto ? (
                        <img
                          style={{ width: "150px", height: "150px" }}
                          onMouseLeave={() => setDel(false)}
                          onMouseEnter={() => setDel(true)}
                          className="logo-update-form"
                          crossOrigin="anonymous"
                          src={details.photo}
                          alt="abc"
                        />
                      ) : (
                        <img
                          style={{ width: "150px", height: "150px" }}
                          className="logo-update-form"
                          crossOrigin="anonymous"
                          src={showPhoto}
                          alt="upload"
                        />
                      )}
                      <div
                        onClick={() => {
                          setPop(true);
                          setConfrim(true);
                        }}
                        style={{ visibility: showDel ? "visible" : "hidden" }}
                        onMouseLeave={() => setDel(false)}
                        onMouseEnter={() => setDel(true)}
                        className="remove-photo"
                      >
                        <span>Remove</span>
                      </div>
                  </div>
                </div>
              </div>
              <div className="phone-input">
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder="Please Enter Your Phone Number"
                  onChange={(e) => setPhoneNo(e.target.value)}
                  value={phoneNo!=="null" && phoneNo}
                />
              </div>
            </form>
            <div>
              <button onClick={handleSubmit}>Save Changes</button>
            </div>
          </main>
        ) : (
          <main className="user-acc-details">
            <h3>Account Details</h3>
            <form className="update-form">
              <div>
                <Skeleton variant="rounded" width={168} height={14} />
                <Skeleton variant="rounded" width={72} height={35} />
                <Skeleton variant="rounded" width={130} height={14} />
              </div>
              <div>
                <div>
                  <div>
                    <label>Name</label>
                    <Skeleton variant="rounded" width={601} height={45} />
                  </div>
                  <div>
                    <label>Date of Birth</label>
                    <Skeleton variant="rounded" width={601} height={45} />
                  </div>
                </div>

                <div className="main-update-photo">
                  <label>
                    <input
                      className="image-upload"
                      onChange={handleImage}
                      type="file"
                    />
                  </label>
                  <div className="user-photo">
                      <Skeleton variant="circular" height={150} width={150} />
                  </div>
                </div>
              </div>
              <div className="phone-input">
                <label>Phone Number</label>
                <Skeleton variant="rounded" width={860} height={45} />
              </div>
            </form>
            <div>
              <button>Save Changes</button>
            </div>
          </main>
        )}
      </section>

      {details && (
        <div
          className="update-modal"
          onClick={(e) => {
            e.target.className === "update-modal" && setPop(false);
            e.target.className === "update-modal" && setConfrim(false);
          }}
          style={{
            visibility: pop ? "visible" : "hidden",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="update-modal-box"
            style={{ left: pop ? "50%" : "-50%" }}
          >
            <div>
              <div>
                <h3>
                  {confirm ? "Delete Profile Photo" : "Update Account Info"}
                </h3>
                <p>
                  {confirm
                    ? "Are you sure, you want to delete your photo ?"
                    : "Are you sure, you want to update your Details ?"}
                </p>
              </div>
              <div>
              <button
                  onClick={() => {
                    setPop(false);
                    setConfrim(false);
                  }}
                >
                  Cancel
                </button>
                {confirm ? (
                  <button
                    onClick={deletePhoto}
                  >
                    Delete
                  </button>
                ) : (
                  <button style={{backgroundColor : "#0073FF"}} onClick={updateApi}>Update</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default My;
