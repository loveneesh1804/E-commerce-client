import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/user/action";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Skeleton } from "@mui/material";

const Navbar = () => {
  const [viewSide, setViewSide] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [Welcome, setWelcome] = useState(false);
  const user = useSelector((state) => state.user.user);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [data, setData] = useState();
  const [search, setSearch] = useState();
  const [searchData, setSearchData] = useState();
  const [empty, setEmpty] = useState();

  //const [cart,setCart] = useState(false);
  const navigate = useNavigate();
  if (user) {
    var decode = jwtDecode(user.token);
  }

  useEffect(() => {
    if (user) {
      async function fetchUser() {
        try {
          var res = await fetch(
            `${process.env.REACT_APP_SERVER}/api/user/${decode.id}`,
            {
              headers: {
                "Content-Type": "Application/json",
                Authorization: user.token,
              },
            }
          );
          let result = await res.json();

          if (result.message === "jwt expired" || !result.sucess) {
            return dispatch(logout());
          }
          if (result.sucess) {
            return setData(result.data);
          }
        } catch (e) {
          return e;
        }
      }
      fetchUser();
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    return toast.success("Loged Out Successfully!");
  };

  const handleSearch = async (e) => {
    try {
      setSearch(e.target.value);
      const res = await fetch(
        `${process.env.REACT_APP_SERVER}/api/product/search?search=${search}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.json();
      if (result.success) {
        return setSearchData(result.data);
      }
    } catch (e) {
      return e;
    }
  };
  return (
    <>
      <div className="navbar">
        <div className="logo">
          <MenuIcon onClick={() => setViewSide(!viewSide)} />
          <h1 onClick={() => navigate("/")}>
            Wisd<span style={{ color: "red" }}>Φ</span>m
          </h1>
        </div>
        <div className="search">
          <input
            onChange={handleSearch}
            value={search ? search : ""}
            placeholder="Search Products"
          />
          {search ? (
            <div className="search-result">
              {searchData ? (
                searchData.map((el) => (
                  <div
                    key={el._id}
                    onClick={() => navigate(`/shop/${el._id}`)}
                    className="search-pros"
                  >
                    <div>
                      <img
                        crossOrigin="anyonmous"
                        src={`${process.env.REACT_APP_SERVER}/${el.photo}`}
                        alt="pro-search"
                      />
                      <div>
                        <p>{el.name}</p>
                        <span>₹{el.price}</span>
                      </div>
                    </div>
                    <div>
                      <SearchIcon />
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-search">
                  No Products Found
                  <div>
                    <SearchOffIcon />
                  </div>
                </div>
              )}
            </div>
          ) : undefined}
        </div>
        <div className="extra">
          <ShoppingBagOutlinedIcon
            className="bag-ico"
            onMouseOver={() => setEmpty(true)}
            onMouseLeave={() => setEmpty(false)}
            onClick={() => {
              navigate("/cart");
            }}
          />
          {cart.length ? (
              <span style={{right : data && "33.85%"}} className="cart-item-qty">{cart.reduce((acc,el)=>acc+=el.quantity,0)}</span>
            ) : undefined}
          <div
            style={{ visibility: empty && !cart.length ? "visible" : "hidden" }}
            className="empty-cart-pop"
          >
            <h1>Your Cart Is Empty</h1>
          </div>
          <div className="content">
            <span
              className="rotate"
              onMouseLeave={() => setShowBrand(false)}
              onMouseOver={() => setShowBrand(true)}
            >
              Brands
              <ExpandMoreIcon />
              <div
                className="inner-brand"
                style={{ visibility: showBrand ? "visible" : "hidden" }}
              >
                <div>
                  <h2>Shop</h2>
                  <span style={{ color: "blue" }}>See All</span>
                </div>
                <div>
                  <ul>
                    <li>
                      <span>Men</span>
                    </li>
                    <li>
                      <span>Women</span>
                    </li>
                    <li>
                      <span>Kids</span>
                    </li>
                    <li style={{ color: "#e32b2b", fontWeight: 700 }}>
                      <span className="red">Sale</span>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <span>Sports</span>
                    </li>
                    <li>
                      <span>Running</span>
                    </li>
                    <li>
                      <span>Outdoor</span>
                    </li>
                    <li>
                      <span>Hiking</span>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <span>T-Shirts</span>
                    </li>
                    <li>
                      <span>Shirts</span>
                    </li>
                    <li>
                      <span>Hoodie</span>
                    </li>
                    <li>
                      <span>Trouser</span>
                    </li>
                  </ul>
                </div>
              </div>
            </span>
            <span onClick={() => navigate("/shop")}>Shop</span>
            <span
              className="rotate"
              onMouseLeave={() => setWelcome(false)}
              onMouseOver={() => setWelcome(true)}
            >
              {user ? "Welcome!" : "Join Us!"}
              <ExpandMoreIcon />
              <div
                className="welcome"
                style={{ visibility: Welcome ? "visible" : "hidden" }}
              >
                {!user ? (
                  <>
                    <span onClick={() => navigate("/login")}>Login</span>
                    <span onClick={() => navigate("/signup")}>Sign Up</span>
                  </>
                ) : (
                  <span onClick={handleLogout}>Logout</span>
                )}
              </div>
            </span>
            {data ? (
              (user && data.photo.split(" ")[0]) === "null" ? (
                <span
                  style={{ background: `${data.photo.split(" ")[1]}` }}
                  onClick={() => navigate(`/my/${decode.id}`)}
                  className="user-logo"
                >
                  {data.name[0].toUpperCase()}
                </span>
              ) : user && data.photo.split(" ")[0] !== "null" ? (
                <img
                  className="logo-main-navbar"
                  crossOrigin="anonymous"
                  onClick={() => navigate(`/my/${decode.id}`)}
                  src={data.photo}
                  alt="abc"
                />
              ) : undefined
            ) : user && !data ? <Skeleton variant="circular" width={38} height={38} /> : undefined}
          </div>
        </div>
      </div>
      <Sidebar view={{ viewSide, setViewSide }} />
      {/* <Cart cart={{cart,setCart}} /> */}
    </>
  );
};

export default Navbar;
