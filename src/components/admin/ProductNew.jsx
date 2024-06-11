import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const ProductNew = ({ view, setView }) => {
  const [data, setData] = useState({});
  const [images, setImages] = useState();
  const [preview, setPreview] = useState();
  const admin = useSelector((state) => state.user.user);

  const handleChange = (e) => {
    let inputs = e.target.name;
    setData({
      ...data,
      [inputs]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, price, stock, category } = data;
      if (!images || !name || !price || stock < 0 || !category) {
        return toast.error("Every Field is Mandatory!");
      }
      const formData = new FormData();
      formData.set("photo", images);
      formData.set("name", name);
      formData.set("price", price.toString());
      formData.set("stock", stock.toString());
      formData.set("category", category);

      var decode = jwtDecode(admin.token);

      const res = await fetch(
        `${process.env.REACT_APP_SERVER}/api/product/new?id=${decode.id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        let id = setTimeout(() => {
          window.location.reload(true);

          return () => clearTimeout(id);
        }, 1000);
        return setView(false);
      } else {
        return toast.error("Something Went Wrong!");
      }
    } catch (e) {
      return toast.error(e);
    }
  };


  const handleImage = (e) => {
    let file = e.target.files;
      if (file[0].type.split("/")[0] !== "image") return toast.error("Invalid File");
      setPreview({name: file[0].name,url: URL.createObjectURL(file[0])});
      setImages(file[0]);
  };


  return (
    <div
      onClick={(e) => e.target.className === "add-product" && setView(false)}
      style={{ visibility: view ? "visible" : "hidden" }}
      className="add-product"
    >
      <div className={view ? "add-pro-div pop-down" : "add-pro-div pop-up"}>
        <h2>New Product</h2>
        <CloseIcon onClick={() => setView(false)} />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              onChange={handleChange}
              name="name"
              placeholder="Enter Name of Product"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              name="price"
              onChange={handleChange}
              type="number"
              placeholder="Enter Price"
            />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input
              name="stock"
              onChange={handleChange}
              type="text"
              placeholder="Enter Stock Avilable"
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              name="category"
              onChange={handleChange}
              type="text"
              placeholder="Enter Stock Avilable"
            />
          </div>
          <div className="upload-img">
            <label>
              <input name="photo" onChange={handleImage} type="file" />
              <div>
                <AddAPhotoIcon />
                <p>Upload Images</p>
                <h4>Upload media image here!</h4>
              </div>
            </label>
          </div>
          {preview && (
            <div className="prev-images">
                <div>
                  <img src={preview.url} alt="logo-upload" />
                </div>
            </div>
          )}
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
};

export default ProductNew;
