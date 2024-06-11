import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useParams } from "react-router-dom";
import fb from "../../assets/shop/fb.png";
import whats from "../../assets/shop/whats.png";
import twit from "../../assets/shop/twit.png";
import msg from "../../assets/shop/msg.png";
import StarIcon from "@mui/icons-material/Star";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Cart from "../../components/common/CartPop";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { addToCart } from "../../redux/cart/action";
import { Skeleton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const ProductShop = () => {
  const { id } = useParams();
  const [product, setProduct] = useState();

  const [size, setSize] = useState("Select Size");
  const [show,setShow] = useState();

  const [review, setReview] = useState();
  const [count, setCount] = useState();
  const [title, setTitle] = useState();
  const [comment, setComment] = useState();
  const [rating, setRating] = useState();
  const [reviewId,setReviewId] = useState();

  const [confirm, setConfirm] = useState();
  const [cart, setCart] = useState();

  const [modal,setModal] = useState();

  const [userData,setUserData] = useState();

  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart);


  const user = useSelector((state) => state.user.user);
  if(user){
    var decoded = jwtDecode(user.token);
  }
  

  if (count) {
    const { r1, r2, r3, r4, r5 } = count;
    var average = Math.round(
      (r1 * 1 + r2 * 2 + r3 * 3 + r4 * 4 + r5 * 5) / count.total
    );

    var r1Percent = ((r1 * 1) / count.total) * 100;
    var r2Percent = ((r2 * 1) / count.total) * 100;
    var r3Percent = ((r3 * 1) / count.total) * 100;
    var r4Percent = ((r4 * 1) / count.total) * 100;
    var r5Percent = ((r5 * 1) / count.total) * 100;
  }

  useEffect(() => {
    if (user) {
      var decode = jwtDecode(user.token);
      const fetchUser = async()=>{
        try {
          const res = await fetch(
            `${process.env.REACT_APP_SERVER}/api/user/${decode.id}`,{
              headers : {
                "Authorization" : user.token
              }
            }
          );
          const result = await res.json();
          if (result.sucess) {
            return setUserData(result.data)
          }
        } catch (e) {
          return e;
        }
      }
      fetchUser();
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER}/api/product/${id}`
        );
        const result = await res.json();
        if (result.success) {
          return setProduct(result.data);
        }
      } catch (e) {
        return e;
      }
    };

    const fetchReview = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER}/api/review/${id}`
        );
        const result = await res.json();

        if (result.success) {
          setCount(result.count);
          setReview(result.data);
          return fetchData();
        }
      } catch (e) {
        return e;
      }
    };

    
    fetchReview();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      return toast.error("Login to Continue!");
    }
    const isValid = review.find(el=>el.userId===userData._id);
    if(isValid){
      return toast.error("Already Reviewed!")
    }


    if (!title || !comment || !rating) {
      return toast.error("All Field are Mandatory");
    }
    if (rating > 5 || rating <= 0) {
      return toast.error("Invalid Rating");
    }
    return setConfirm(true);
  };

  const handlePost = async () => {
    try {

      const res = await fetch(
        `${process.env.REACT_APP_SERVER}/api/review/new/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            comment,
            productId: id,
            rating,
            photo: userData.photo,
            user: userData.name,
            userId : userData._id
          }),
        }
      );

      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        setConfirm(false);
        let id = setTimeout(() => {
          window.location.reload(true);
          return () => clearTimeout(id);
        }, 1000);
      } else {
        return toast.error("Something Went Wrong!");
      }
    } catch (e) {
      return e;
    }
  };

  const handleAddToCart = () => {
    if(size==="Select Size"){
      return toast.error("Select Size!");
    }
    const payload = {...product,size,quantity : 1};
    let totalQty = 0;
    cartData.forEach(el=>{
      if(el._id===product._id){
        totalQty += el.quantity;
      }
    })
    if(totalQty>=product.stock){
      return toast.error(`Only ${product.stock} items left!`)
    }
    setCart(true);
    toast.success("Added Successfully!");
    return dispatch(addToCart(payload));
  };

  const handleDelete=async()=>{
    try{
      const res = await fetch(`${process.env.REACT_APP_SERVER}/api/review/${reviewId}`,{
        method : "DELETE"
      });
      const result = await res.json();

      if(result.success){
        let id = setTimeout(() => {
          window.location.reload(true);
          return () => clearTimeout(id);
        }, 1000);
        return toast.success(result.message);
      }
      else{
        return toast.error(result.message);
      }

    }catch(e){
      return toast.error("Invalid Request");
    }
  }

  const handleConfirm=(id)=>{
    setModal(true);
    setReviewId(id);
  }

  return (
    <>
      <Header />

      <Navbar />

      <Cart cart={{ cart, setCart }} />

      <section className="product-page" onClick={(e) => {
        if(show){
          if(e.target.className !== "size-select") setShow(false);
        }
      }}>
        {product ? (
          <>
            <div className="product-info">
              <div className="product-info-img">
                <img
                  crossOrigin="anyonmous"
                  src={`${process.env.REACT_APP_SERVER}/${product.photo}`}
                  alt="product"
                  loading="lazy"
                />
                <span
                  style={{ color: product.stock <= 0 && "red" }}
                  className="pro-stock"
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="product-info-details">
                <h2>{product.name}</h2>
                <p>{product.category}</p>
                <h4>See more from Wisdom</h4>
                <p style={{ fontSize: "13px", marginBottom: "20px" }}>
                  This fibre is produced using no artificial fertilisers or
                  pesticides and is grown from seeds that have not been
                  genetically modified. We are currently working with the
                  Organic Content Standard (OCS) that monitors the process from
                  the source to the end product.
                </p>
                <span>₹{product.price}</span>


                <section>
                  <span>Size</span>
                  <div className="size-select">
                    <div onClick={() => setShow(true)}>
                      <p onClick={() => setShow(true)}>{size}</p>
                      <KeyboardArrowUpIcon  onClick={() => setShow(true)} className={show ? "rotate-ico" : undefined} />
                    </div>
                    <div onClick={() => setShow(false)} style={{ visibility: show ? "visible" : "hidden" }} className="option-size">
                        <p onClick={(e)=>setSize(e.target.firstChild.data)}>XS</p>
                        <p onClick={(e)=>setSize(e.target.firstChild.data)}>S</p>
                        <p onClick={(e)=>setSize(e.target.firstChild.data)}>M</p>
                        <p onClick={(e)=>setSize(e.target.firstChild.data)}>L</p>
                        <p onClick={(e)=>setSize(e.target.firstChild.data)}>XL</p>
                    </div>
                  </div>
                </section>



                <div className="icons">
                  <img src={fb} alt="" />
                  <img src={twit} alt="" />
                  <img src={msg} alt="" />
                  <img src={whats} alt="" />
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 && true}
                >
                  {" "}
                  <ShoppingBagOutlinedIcon />
                  Add To Bag
                </button>
              </div>
            </div>

            <div className="product-rating">
              {review && (
                <div className="rating">
                  <h3>Rating</h3>
                  <div className="rating-star-box">
                    {average > 0 ? (
                      <div className="star-rating">
                        {new Array(average).fill(0).map((el,i) => (
                          <StarIcon key={i} />
                        ))}
                        {new Array(5 - average).fill(0).map((el,i) => (
                          <StarIcon key={i} style={{ color: "rgb(200,200,200)" }} />
                        ))}
                      </div>
                    ) : (
                      <div className="star-rating">
                        {new Array(5).fill(0).map((el,i) => (
                          <StarIcon key={i} style={{ color: "rgb(200,200,200)" }} />
                        ))}
                      </div>
                    )}

                    <div>
                      {review.length
                        ? `based on ${count.total} reviews.`
                        : `No Reviews Yet`}
                    </div>
                  </div>

                  <div className="gap"></div>

                  <div className="rating-percent">
                    <div className="rate-progress">
                      <span>5 star</span>
                      <div className="rate">
                        <div
                          style={{
                            backgroundColor: "#4CAF50",
                            width: `${r5Percent}%`,
                          }}
                          className="main-rate"
                        ></div>
                      </div>
                      <span>{~~r5Percent}%</span>
                    </div>

                    <div className="rate-progress">
                      <span>4 star</span>
                      <div className="rate">
                        <div
                          style={{
                            backgroundColor: "#2196F3",
                            width: `${r4Percent}%`,
                          }}
                          className="main-rate"
                        ></div>
                      </div>
                      <span>{~~r4Percent}%</span>
                    </div>

                    <div className="rate-progress">
                      <span>3 star</span>
                      <div className="rate">
                        <div
                          style={{
                            backgroundColor: "#00BCD4",
                            width: `${r3Percent}%`,
                          }}
                          className="main-rate"
                        ></div>
                      </div>
                      <span>{~~r3Percent}%</span>
                    </div>

                    <div className="rate-progress">
                      <span>2 star</span>
                      <div className="rate">
                        <div
                          style={{
                            backgroundColor: "#E6631A",
                            width: `${r2Percent}%`,
                          }}
                          className="main-rate"
                        ></div>
                      </div>
                      <span>{~~r2Percent}%</span>
                    </div>

                    <div className="rate-progress">
                      <span>1 star</span>
                      <div className="rate">
                        <div
                          style={{
                            backgroundColor: "#E6331A",
                            width: `${r1Percent}%`,
                          }}
                          className="main-rate"
                        ></div>
                      </div>
                      <span>{~~r1Percent}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="comments">
                {review &&
                  review.map((el) => (
                    
                    <div key={el._id} className="review">
                      {(user && el.userId===decoded.id) ? <CloseIcon style={{fontSize : "18px"}} onClick={()=>handleConfirm(el._id)} className="pin" /> : undefined}
                      
                      {(el.photo.split(" ")[0] === "null") ? (
                        <div
                          style={{
                            backgroundColor: `${el.photo.split(" ")[1]}`
                          }}
                          className="user-icon"
                        >
                          {el.user[0].toUpperCase()}
                        </div>
                      ) : (
                        <img
                          className="rev-img"
                          src={`${process.env.REACT_APP_SERVER}/${el.photo}`}
                          crossOrigin="anyonmous"
                          alt="rev"
                        />
                      )}
                      <div className="comment-content">
                        <h4>{el.title}</h4>
                        <span>{el.createdAt.split("T")}</span>
                        <p>{el.comment}</p>
                      </div>
                      <div className="star-rating">
                        {new Array(el.rating).fill(0).map((el) => (
                          <StarIcon />
                        ))}
                        {new Array(5 - el.rating).fill(0).map((el) => (
                          <StarIcon style={{ color: "rgb(200,200,200)" }} />
                        ))}
                      </div>
                    </div>
                  ))}

                <div className="publish-review">
                  <h3>Add Review</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        onChange={(e) => setTitle(e.target.value)}
                        value={title ? title : ""}
                        name="title"
                        type="text"
                        placeholder="Enter Review Title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Comment</label>
                      <textarea
                        onChange={(e) => setComment(e.target.value)}
                        value={comment ? comment : ""}
                        style={{ border: "none" }}
                        placeholder="Write Comment"
                        cols="68"
                        rows="5"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label>Rating</label>
                      <input
                        onChange={(e) => setRating(e.target.value)}
                        value={rating ? rating : ""}
                        name="rating"
                        min={1}
                        max={5}
                        type="number"
                        placeholder="Enter Rating From 1 to 5"
                      />
                    </div>
                    <button type="submit">Publish Review</button>
                  </form>
                </div>
              </div>
            </div>
          </>
        ) : <>
        <div className="product-info">
              <div className="product-info-img">
                <Skeleton variant="rounded" width={340} height={510} />
              </div>
              <div className="product-info-details">
                <Skeleton variant="rounded" width={300} height={30} />
                <Skeleton variant="rounded" style={{marginTop:"5px"}} width={80} height={15} />
                <Skeleton variant="rounded" style={{marginTop:"25px",marginBottom:"4px"}} width={200} height={20} />
                <Skeleton variant="rounded" width={582} height={100} style={{marginBottom : "20px"}} />
                <Skeleton variant="rounded" width={97} height={36} />


                <section>
                    <Skeleton style={{marginTop : "4px"}} variant="rounded" width={50} height={11} />
                    <Skeleton style={{marginTop : "4px"}} variant="rounded" width={565} height={48} />
                </section>



                <div className="icons">
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={40} height={40} />

                </div>
                <Skeleton style={{marginTop: "30px"}} width={165} height={44} variant="rounded"  />
              </div>
        </div>
        <div className="product-rating">
                <div className="rating">
                  <Skeleton width={140} height={20} variant="rounded" />
            
                  <div className="gap" style={{marginBottom :"30px"}}></div>

                  <div className="rating-percent">
                    {new Array(5).fill(0).map((el,i)=>(
                      <div key={i} className="rate-progress">
                      <Skeleton width={40} height={10} variant="rounded" />
                        <div className="rate">
                          
                        </div>
                        <Skeleton width={20} height={18} variant="rounded" />
                      </div>
                    ))}
                  </div>
                </div>

              <div className="comments">
                {
                  new Array(2).fill(0).map((el,i) => (
                    
                    <div key={i} className="review">
                      
                      <Skeleton width={48} height={48} variant="circular" />
                      <div className="comment-content">
                        <Skeleton width={100} height={18} variant="rounded" />
                        <Skeleton width={150} style={{margin : "4px 0px"}} height={10} variant="rounded" />
                        <Skeleton width={500} height={80} variant="rounded" />
                      </div>
                      
                    </div>
                  ))}
              </div>
            </div>
        
        </>}
      </section>


      {modal ? (
        <div
          className="update-modal"
          onClick={(e) =>
            e.target.className === "update-modal" && setModal(false)
          }
          style={{
            visibility: modal ? "visible" : "hidden",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="update-modal-box"
            style={{ left: modal ? "50%" : "-50%" }}
          >
            <div>
              <div>
                <h3>Delete Review</h3>
                <p>Are you sure, you want to delete this Review ?</p>
              </div>
              <div>
                <button onClick={() => setModal(false)}>Cancel</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      ) : undefined}


      {user ? (
        <div
          className="update-modal"
          onClick={(e) =>
            e.target.className === "update-modal" && setConfirm(false)
          }
          style={{
            visibility: confirm ? "visible" : "hidden",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="update-modal-box"
            style={{ left: confirm ? "50%" : "-50%" }}
          >
            <div>
              <div>
                <h3>Post Review</h3>
                <p>Are you sure, you want to post this Review ?</p>
              </div>
              <div>
                <button onClick={() => setConfirm(false)}>Cancel</button>
                <button style={{backgroundColor : "#0073FF"}} onClick={handlePost}>Post</button>
              </div>
            </div>
          </div>
        </div>
      ) : undefined}

      <Footer />
    </>
  );
};

export default ProductShop;
