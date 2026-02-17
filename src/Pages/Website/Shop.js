import axios from "axios";
import React, { useEffect, useState } from "react";
import NavBar from "../../Components/Website/NavBar";
import MobileNavBar from "../../Components/Website/MobileNavBar";
import Loading from "../../Components/Loading/Loading";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Shop = () => {
     
    const [products,setProducts] = useState([])
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const { t } = useTranslation();
    
    const API_BASE = "https://store-3t4b.onrender.com";
    const resolveImageUrl = (image) => {
      if (!image) return "";
      // if it's already an absolute URL, return as-is; otherwise prepend base
      return /^https?:\/\//i.test(image) ? image : `${API_BASE}${image}`;
    };
    async function getProducts() {
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/products");
      setProducts(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);
  return (
    loading ? <Loading /> :error ? (
    <p>{t("failed-to-load-products")}</p>
  ) : <div className="scroll-bar min-h-screen">
          <div className="hidden md:block">
            <NavBar />
          </div>
          <div className="md:hidden">
            <MobileNavBar />
          </div>
      <div className="md:pt-44 pt-20 container flex justify-center">
        <div className="w-[90%]">
            <h2 className="text-secondaryColor/70 text-3xl font-bold py-10 text-center">{t("products")}</h2>
          <div className="grid grid-cols-12 gap-3">
            {products.map((product, index) => (
              <Link
                to={`/products/${product._id}`}
                className="bg-white shadow-md rounded-lg dark:bg-gray-800 dark:border-gray-700 col-span-12 md:col-span-4 flex justify-center items-center"
                key={index}
              >
                <div className="w-full">
                  <div className="flex justify-center">
                    <img
                      className="rounded-t-lg p-8 w-64 h-52"
                      src={product.imagesUrl?.length > 0 ? resolveImageUrl(product.imagesUrl[0]) : ""}
                      alt={product.name}
                    />
                  </div>
                  <div className="px-5 pb-5">
                    <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white">
                      {product.name}
                    </h3>
                    <div className="flex items-center mt-2.5 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                        5.0
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
