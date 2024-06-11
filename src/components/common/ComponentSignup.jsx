import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ComponentSignup = () => {
  const navigate = useNavigate();

  const [gender, setGender] = useState("Select Gender");
  const [showGender, setShowGender] = useState(false);

  const [data, setData] = useState({});
  const [showPassword,setShowPassword] = useState();

  const user = useSelector((state) => state.user.user);

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

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    let inputs = e.target.name;
    setData({
      ...data,
      [inputs]: e.target.value,
    });
  };

  const handleSubmit = () => {
    const { name, password, confirm, dob, username } = data;
    if (!name || !password || !confirm || !dob || !username) {
      return toast.error("Please Fill All Fields");
    }
    if(password.length<8){
      return toast.error("Password Should Contain Atleast 8 characters!");
    }
    if (gender === "Select Gender") {
      return toast.error("Select Gender!");
    }
    if (confirm !== password) {
      return toast.error("Password Does'nt Match!");
    } 
    const randColor = Math.floor(Math.random() * colorData.length);
    const photoColor = colorData[randColor];

    const payload = {
      name,
      password,
      username,
      dob,
      gender,
      _id: uuid(),
      photo: `null ${photoColor}`,
      phoneNo : "null"
    };
    handleSignIn(payload);
  };

  const handleSignIn = async (payload) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER}/api/user/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.sucess) {
        return toast.error(data.message);
      }

      if (data.sucess) {
        toast.success(data.message);
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      toast.error("Login Failed");
    }
  };

  return (
    <div
      className="signup"
      onClick={(e) =>
        showGender &&
        e.target.className !== "gender-select" &&
        setShowGender(false)
      }
    >
      <h1>Sign Up</h1>
      <div className="signup-content">
        <form autoComplete="off" className="signup-form">
          <p>Email Address</p>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            placeholder="Please Enter Your Email"
          />
          <p>Full Name</p>
          <input
            type="text"
            name="name"
            placeholder="Please Enter Your First Name"
            onChange={handleChange}
          />
          <div className="password-sign-up">
            <p>Password</p>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Please Enter Password"
              onChange={handleChange}
            />
            {showPassword ? <VisibilityOffIcon className="visibility"  onClick={()=>setShowPassword(false)}  /> : <VisibilityIcon onClick={()=>setShowPassword(true)} className="visibility" />}
          </div>
          <p>Confirm Password</p>
          <input
            type="text"
            name="confirm"
            placeholder="Re-enter Your Password"
            onChange={handleChange}
          />
        </form>
        <form className="signup-personal">
          <p>Date of Birth</p>
          <input type="Date" name="dob" onChange={handleChange} />
          <p>Gender</p>
          <div className="gender-select" onClick={() => setShowGender(true)}>
            <p style={{ color: gender !== "Select Gender" && "black" }}>
              {gender}
            </p>
            <KeyboardArrowUpIcon className={showGender ? "ico" : undefined} />
            <div style={{ visibility: showGender ? "visible" : "hidden" }}>
              <p onClick={(e) => setGender(e.target.firstChild.data)}>Male</p>
              <p onClick={(e) => setGender(e.target.firstChild.data)}>Female</p>
            </div>
            <span className="legend">Personal Details</span>
          </div>
        </form>
      </div>
      <div>
        <input type="checkbox" />
        <span>Subscribe to newsletter</span>
      </div>
      <div className="sign-but">
        <button onClick={handleSubmit}>Sign Up</button>
        <p onClick={() => navigate("/login")}>Back To Login</p>
      </div>
    </div>
  );
};

export default ComponentSignup;
