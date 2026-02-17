import React, { useContext, useEffect, useState } from "react";
import NavBar from "../../Components/Website/NavBar";
import MobileNavBar from "../../Components/Website/MobileNavBar";
import axios from "axios";
import Loading from "../../Components/Loading/Loading";
import { Link } from "react-router-dom";
import { User } from "../../Context/UserContext";
import Cookie from "cookie-universal";
import ReactJsAlert from "reactjs-alert";
import AlertComponent from "../../Components/Website/Alert/Alert";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ProductPage.css'
// import required modules
import { Navigation, Pagination } from 'swiper/modules';
import { useTranslation } from "react-i18next";

const ProductPage = () => {
  const id = window.location.pathname.split("/").slice(-1).toString();
    const { t } = useTranslation();
  const context = useContext(User);
  const userRole = context.user.role;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [count, setCount] = useState(1);
  const [openSections, setOpenSections] = useState({
    shipping: false,
    contact: false,
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const cookie = Cookie();
  const access = cookie.get("access");
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  async function getProduct() {
    setLoading(true);
    try {
      let res = await axios.get(`https://store-3t4b.onrender.com/products/${id}`);
      setProduct(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  const API_BASE = "https://store-3t4b.onrender.com";
  const resolveImageUrl = (image) => {
    if (!image) return "";
    return /^https?:\/\//i.test(image) ? image : `${API_BASE}${image}`;
  };
  async function AddToCart() {
    setLoading(true);
    if(userRole ==="admin"){
     setLoading(false)
     setSubmitStatus("admin")
     return;
    }
    try {
      await axios.post(
        "https://store-3t4b.onrender.com/cart",
        {
          name: product.name,
          price: product.price,
          imageUrl: product.imagesUrl[0],
          stock: count,
        },
        {
          headers: {
            Authorization: access ? access : "",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    } finally {
      setLoading(false);
    }
  }
  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setCount((prev) => Math.max((prev || 1) - 1, 1));
  };

  useEffect(() => {
    getProduct();
  }, []);
  return loading ? (
    <Loading />
  ) : (
    <div className="scroll-bar bg-[#edf2f7] min-h-screen">
      <div className="hidden md:block pb-36">
        <NavBar />
      </div>
      <div className="md:hidden pb-10">
        <MobileNavBar />
      </div>
      <div className=" overflow-x-hidden flex items-center justify-center">
        <div className="md:ltr:flex-row md:rtl:flex-row-reverse md:flex  items-start w-full justify-around py-12 px-4">
          {/* Desktop Images */}
          <div className=" w-80 md:block hidden " style={{ width: '600px' }}>
            <Swiper
              navigation={true}
              pagination={true}
              modules={[Navigation, Pagination]}
              className="mySwiper"
            >
                  {product.imagesUrl.map((image, index) => (
                <SwiperSlide className="flex justify-center" key={index}>
                  <img
                    className="md:w-full h-[50vh] w-20"
                    alt={`${product.name} - ${index + 1}`}
                        src={resolveImageUrl(image)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Mobile Images */}
          <div className="md:hidden">
            <Swiper
              pagination={true}
              modules={[Pagination]}
              className="mySwiper"
            >
              {product.imagesUrl.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    className="w-full h-[25vh]"
                    alt={`${product.name} - ${index + 1}`}
                    src={resolveImageUrl(image)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Product Info */}
          <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
            <div className="border-b border-gray-200 pb-6">
              <Link
                to={`/categories/${product.category._id}`}
                className="text-sm leading-none text-gray-600 dark:text-gray-300"
              >
                {product.category.name}
              </Link>
              <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 dark:text-white mt-2">
                {product.name}
              </h1>
            </div>

            <div>
              <p className="text-base leading-4 mt-7 text-secondaryColor font-semibold dark:text-gray-300">
                {t("price")}: 
                <span className=" text-gray-600 pt-2 font-[400] ltr:pl-2 rtl:pr-2">
                   {product.price}
                </span>
              </p>
                       <div className="pt-5">
              <h2 className="font-semibold text-secondaryColor">{t("quantity")}</h2>
              <div className="flex justify-start items-center gap-x-5 pt-5">
                <button
                  onClick={handleDecrement}
                  className="border rounded-md w-14 py-2 border-secondaryColor hover:border-secondaryColor transition duration-300"
                >
                  -
                </button>
                <div className="flex justify-center items-center">
                  <h3 className="text-center">{count}</h3>
                </div>
                <button
                  onClick={handleIncrement}
                  className="border rounded-md w-14 py-2 border-secondaryColor hover:border-secondaryColor transition duration-300"
                >
                  +
                </button>
              </div>
            </div>
              <p className="ltr:xl:pr-48 rtl:xl:pl-48 text-base font-semibold lg:leading-tight leading-normal text-secondaryColor dark:text-gray-300 mt-7">
                {t("description")}:
                <span className="block text-gray-600 pt-2 font-[400]">
                  {product.description}
                </span>
              </p>
            </div>
            <button
              onClick={() => AddToCart()}
              className="dark:bg-white mt-8 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-secondaryColor/90 rounded-lg w-full py-4 hover:bg-gray-700"
            >
              {t("add-to-cart")}
            </button>
          </div>
        </div>
      </div>
      {submitStatus && (
        <AlertComponent
          status={submitStatus}
          message={
            submitStatus === "success"
              ? `${product.name} is added to cart !!`
              : submitStatus === "admin" ? "admin cannot buy items" 
              : `Failed to add ${product.name} to cart`
          }
        />
      )}
    </div>
  );
};

export default ProductPage;
