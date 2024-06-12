import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TuneIcon from "@mui/icons-material/Tune";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";

const Shop = () => {
  const [sort, setSort] = useState("Sort By");
  const [show, setShow] = useState(false);
  const [variety, setVariety] = useState("Select Category");
  const [category, setCategory] = useState(false);

  const [price, setPrice] = useState(100000);
  const [filter, setFilter] = useState(true);



  const [products, setProducts] = useState();
  const [page,setpage] = useState(0);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalProducts,setTotalProducts] = useState(0);
  const [totalCategory,setTotalCategory] = useState(0);

  const isPrevPage = currentPage>1;
  const isNextPage = currentPage<page;

  const navigate = useNavigate();

  useEffect(() => {

    async function fetchData() {
      try {
        let baseQuery = `?page=${currentPage}`

        if(variety!=="Select Category"){
          if(variety!=="All"){
            baseQuery += `&category=${variety}`
          }
        }
        if(sort!=="Sort By"){
          if(sort === "Price Low to High"){
            baseQuery += `&sort=ascending`
          }
        }
        if(price){
          baseQuery += `&price=${price}`
        }

        const res = await fetch(
          `${process.env.REACT_APP_SERVER}/api/product/search${baseQuery}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
            },
          }
        );

        const result = await res.json();
        if (result.success) {
          setTotalProducts(result.data.length);
          setpage(result.totalPage);
          return setProducts(result.data);
        } else {
          return toast.error("No Products")
        }
      } catch (e) {
        return e;
      }
    }

    async function fetchCategory(){
      try{
        const res = await fetch(`${process.env.REACT_APP_SERVER}/api/product/category`);
        const result = await res.json();
        if(result.success){
          return setTotalCategory(result.categories);
        }
      }catch(e){
        return e;
      }
    }

    fetchData();
    fetchCategory();
  }, [variety,sort,price,currentPage]);

  // const handleImageLoading=()=>(
  //   <Skeleton variant="rounded" width={230} height={345} />
  // )

  return (
    <div
      onClick={(e) => {
        if (show || category) {
          if (
            e.target.className !== "sort-tab-by" &&
            e.target.className !== "love"
          ) {
            setCategory(false);
            setShow(false);
          }
        }
      }}
    >
      <Header />
      <Navbar />
      <section className="shop">
        <div className="filter-shop" style={{ opacity: filter ? "1" : "0" }}>
          <h2>Filters</h2>
          <h4>Sort By</h4>
          <div
            className="sort-tab-by"
            style={{ opacity: filter ? "1" : "0" }}
            onClick={() => setShow(true)}
          >
            <p onClick={() => setShow(true)}>{sort}</p>
            <div style={{ visibility: show ? "visible" : "hidden" }}>
              <p onClick={(e) => setSort(e.target.firstChild.data)}>
                Latest First
              </p>
              <p onClick={(e) => setSort(e.target.firstChild.data)}>
                Price High to Low
              </p>
              <p onClick={(e) => setSort(e.target.firstChild.data)}>
                Price Low to High
              </p>
            </div>
            <KeyboardArrowUpIcon
              onClick={() => setShow(true)}
              className={show ? "rotate-ico" : undefined}
            />
          </div>

          <div style={{ opacity: filter ? "1" : "0" }} className="range-sort">
            <h4>Price</h4>
            <input
              type="range"
              value={price}
              min={100}
              max={100000}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <div>
              <span>₹1</span>
              <span>₹{price}</span>
            </div>
          </div>

          <div
            style={{ opacity: filter ? "1" : "0" }}
            className="shop-cat-sort"
          >
            <h4>Category</h4>
            <div className="love" onClick={() => setCategory(true)}>
              <p onClick={() => setCategory(true)}>{variety}</p>
              <div style={{ visibility: category ? "visible" : "hidden" }}>
                <p onClick={(e) => setVariety(e.target.firstChild.data)}>All</p>
                {totalCategory ? totalCategory.map((el,i)=>(
                  <p key={i} onClick={(e) => setVariety(e.target.firstChild.data)}>{el}</p>
                )) : <div></div>}
              </div>
              <KeyboardArrowUpIcon
                onClick={() => setCategory(true)}
                className={category ? "rotate-ico" : undefined}
              />
            </div>
          </div>
        </div>

        <div className="main-wrap" style={{width: !filter && "70%"}}>
          <div
            className="main-shop"
            style={{ width: filter ? "74.5%" : "120%", right : !filter && "-11%" }}
          >
            <div className="sort-tab">
              <div className="total-product">
                <span>Showing </span>
                <p>: 1-12 products of {totalProducts} products</p>
              </div>
              <div className="hide-sort" onClick={() => setFilter(!filter)}>
                <span>{filter ? "Hide Filter" : "Show Filter"}</span>
                <TuneIcon />
              </div>
            </div>
            {products ? <div className="main-items">
              <h2>Products</h2>
              <div className={filter ? "main-products-grid" : "main-gird-without-filter"}>
                  {products.map((el) => (
                    <div
                      style={{ width: !filter && "300px" }}
                      className="main-product"
                      key={el._id}
                      onClick={()=>navigate(`/shop/${el._id}`)}
                    >

                      <img
                      style={{ width: !filter && "300px"}}
                      crossOrigin="anonymous"
                      src={el.photo}
                      alt="products"
                      onLoad={()=>(<Skeleton variant="rounded" width={230} height={345} />)}
                      />

                      <span style={{ bottom: !filter && "17%" }}>
                        ₹ {el.price}
                      </span>
                      <p>{el.name}</p>
                      <h6>{el.category}</h6>
                    </div>
                  ))}

              </div>

              {page && <div className="page-shop">
                <button disabled={!isPrevPage} onClick={()=>setCurrentPage(prev=>prev-1)}>Prev</button>
                <span>{currentPage} - {page}</span>
                <button disabled={!isNextPage} onClick={()=>setCurrentPage(prev=>prev+1)}>Next</button>
              </div>
              }
            </div> : 
              <div className="skeleton-shop">
                <h2>Products</h2>
                <div className='skeleton-product-grid'>
                  {new Array(15).fill(0).map(()=>(
                  <div >
                    <Skeleton variant="rounded" width={230} height={345} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} width={150} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
                  </div>
                ))}
                </div>
              </div> 
                }
          </div>
        </div>
        </section>
      
      
      <Footer />
    </div>
  );
};

export default Shop;
