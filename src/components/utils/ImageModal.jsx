import React from "react";
import { useLocation } from "react-router-dom";

const ImageModal = ({ modal, setModal }) => {
  const location = useLocation();
  const image = localStorage.getItem("image-modal");
  return (
    <div
      onClick={(e) => e.target.className === "image-modal" && setModal(false)}
      style={{ visibility: modal ? "visible" : "hidden" }}
      className="image-modal"
    >
      {location.pathname.includes("/users") ? (
        <img 
          crossOrigin='anonymous'
          style={{width : "200px",height:"200px",objectFit : "cover",borderRadius : "50%"}}
          className={modal ? "img-modal pop-bubble" : "img-modal"}
          src={image}
          alt="product"
        />
      ) : (
        <img crossOrigin='anonymous'
          className={modal ? "img-modal pop-bubble" : "img-modal"}
          src={`${process.env.REACT_APP_SERVER}/${image}`}
          alt="product"
        />
      )}
    </div>
  );
};

export default ImageModal;
