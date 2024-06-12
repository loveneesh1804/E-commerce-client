import React, { useEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Sidebar from '../../../components/admin/AdminSidebar';
import { useNavigate, useParams } from 'react-router-dom';
import {toast} from "react-hot-toast";
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Skeleton } from '@mui/material';

const Manage = () => {
  const [product,setProduct] = useState();
  const params = useParams();
  const navigate = useNavigate();

  const [photo,setPhoto] = useState();
  const [name,setName] = useState();
  const [price,setPrice] = useState();
  const [stock,setStock] = useState();
  const [category,setCategory] = useState();

  const [modal,setModal] = useState();
  const [deleteModal,setDelete] = useState();

  const user = useSelector(state=>state.user.user);
  const decoded = jwtDecode(user.token);


  useEffect(()=>{
    async function fetchProduct(){
        try{
            const res = await fetch(`${process.env.REACT_APP_SERVER}/api/product/${params.id}`);
            const result = await res.json();
            if(result.success){
                setProduct(result.data);
                setName(result.data.name);
                setPrice(result.data.price);
                setStock(result.data.stock);
                return setCategory(result.data.category);
            }
        }
        catch(e){
            return e;
        }
        }
        fetchProduct();
    },[])

  const handleSubmit=(e)=>{
    e.preventDefault();

    if(!name && !photo && !stock && !price && category){
        return toast.error("Nothing to Update!")
    }
    if(name===product.name && price===product.price && stock===product.stock && category===product.category){
        return toast.error("No New Changed Data Found!")
    }
    else{
        setModal(true);
    }
  }

  const updateApi=()=>{

    const formData = new FormData();
    if(name) formData.set("name",name);
    if(photo) formData.set("photo",photo);
    if(stock) formData.set("stock",stock.toString());
    if(price) formData.set("price",price.toString());
    if(category) formData.set("category",category);

    async function updateData(){
        try{
            const res = await fetch(`${process.env.REACT_APP_SERVER}/api/product/${product._id}?id=${decoded.id}`,{
                method : "PUT",
                body : formData
            });
            const result = await res.json();

            if(result.success){
                toast.success("Updated Successfully!");
                setModal(false);
                return navigate("/admin/products")
            }
        }
        catch(e){
            return toast.error("Something Went Wrong!");
        }
    }
    updateData();
  }

  const handleDelete=async()=>{
    try{
        setDelete(true);
        const res = await fetch(`${process.env.REACT_APP_SERVER}/api/product/${product._id}?id=${decoded.id}`,{
            method : "DELETE"
        });
        const result = await res.json();

        if(result.success){
            setDelete(false);
            toast.success("Deleted Successfully!")
            return navigate("/admin/products");
        }
        else{
            return toast.error("Something Went Wrong!")
        }
    }
    catch(e){
        return e;
    }
  }

  const handleImage=(e)=>{
        const file = e.target.files?.[0];

        const reader = new FileReader();
        if(file){
            reader.readAsDataURL(file);
            reader.onloadend = ()=>{
                if(typeof reader.result==="string") setPhoto(reader.result);
            }
        }
  }
  return (
    <>
        <div className='admin-products'>
            <Sidebar />
            {product ? <div className='manage-product'>
                <div onClick={()=>navigate("/admin/products")} className="back">
                    <ArrowBackIosIcon />
                </div>
                <div className='product-manage-info'>
                    <span style={{color : product.stock<0 ? "red" : null}}>{product.stock} {product.stock>0 ? "Available" : "Out of Stock"}</span>
                    <p>PRODUCT ID - {product._id}</p>
                    <img crossOrigin='anonymous'  src={product.photo} alt="info" />
                    <div>
                        <h5>{product.name}</h5>
                        <h2>₹{product.price}</h2>
                    </div>
                </div>
                <div className='product-manage'>
                <h1>Manage</h1>
                <DeleteIcon onClick={()=>setDelete(true)} style={{fontSize : "30px"}} className='del-ico-product' />
                <form onSubmit={handleSubmit} >
                        <div className="form-group">
                            <label>Name</label>
                            <input value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder='Enter Name of Product' />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input value={price} onChange={(e)=>Number(setPrice(e.target.value))} type="number" placeholder='Enter Price' />
                        </div>
                        <div className="form-group">
                            <label>Stock</label>
                            <input value={stock} onChange={(e)=>Number(setStock(e.target.value))} type="text" placeholder='Enter Stock Avilable' />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input value={category} onChange={(e)=>setCategory(e.target.value)} type="text" placeholder='Enter Category Avilable' />
                        </div>
                        <div className="form-group">
                            <label>Photo</label>
                            <input onChange={handleImage} type="file" />
                        </div>
                        <button type='submit'>Update</button>
                    </form>
                    {photo && <img style={{width : "100px",height:"150px"}} src={photo} alt="upload" />}
                </div>
            </div> 
            : 
            <div className='manage-product skeleton'>
                <div className='product-manage skeleton-manage'>
                    <Skeleton style={{marginLeft : "150px"}} width={150} height={20} variant='reactangular' />
                    <Skeleton width={300} height={17} variant='text' />
                    <Skeleton width={320} height={480} variant='rounded' />
                    <div>
                        <Skeleton width={200} height={20} variant='reactangular' />
                        <Skeleton width={100} height={30} variant='reactangular' />
                    </div>
                </div>
                <div className='product-manage'>
                <h1>Manage</h1>
                <form className='skeleton-form'>
                    <Skeleton width={329} height={45} variant='rounded' />
                    <Skeleton width={329} height={45} variant='rounded' />
                    <Skeleton width={329} height={45} variant='rounded' />
                    <Skeleton width={329} height={45} variant='rounded' />
                    <Skeleton width={329} height={45} variant='rounded' />
                    <Skeleton width={226} height={42} variant='rounded' />
                    </form>
                </div>
            </div> 
            }
        </div>

        {/* Modal */}

        {product && <div className="update-modal"
        onClick={(e)=>e.target.className==="update-modal" && setModal(false)}
         style={{visibility : modal ? "visible" : "hidden"}}>
            <div className="update-modal-box" style={{left : modal ? "50%" : "-50%"}}>
                <div>
                    <div>
                        <h3>Update Product</h3>
                        <p>Are you sure, you want to update {product.name} ?</p>
                    </div>
                    <div>
                        <button onClick={()=>setModal(false)}>Cancel</button>
                        <button style={{backgroundColor : "#0073FF"}} onClick={updateApi}>Update</button>
                    </div>
                </div>
            </div>
        </div>}


        {product && <div className="update-modal"
        onClick={(e)=>e.target.className==="update-modal" && setDelete(false)}
         style={{visibility : deleteModal ? "visible" : "hidden",backgroundColor : "rgba(0,0,0,0.5)"}}>
            <div className="update-modal-box" style={{left : deleteModal ? "50%" : "-50%"}}>
                <div>
                    <div>
                        <h3>Delete Product</h3>
                        <p>Are you sure, you want to delete {product.name} ?</p>
                    </div>
                    <div>
                        <button onClick={()=>setDelete(false)}>Cancel</button>
                        <button style={{backgroundColor : "#DC3545"}} onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </div>}
    </>
   
  )
}

export default Manage