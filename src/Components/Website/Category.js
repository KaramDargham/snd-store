import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import NavBar from "./NavBar";
import { useEffect, useState } from "react";
import axios from "axios";
import MobileNavBar from "./MobileNavBar";
import Loading from "../Loading/Loading";
import { useTranslation } from "react-i18next";
export default function Category() {
  const categoryId = window.location.pathname.split("/").slice(-1).toString();
   const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  async function getProducts() {
    setLoading(true);
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/products");
      const filterProductsByName = res.data.filter(
        (product) => product.category._id === categoryId
      );
      setProducts(filterProductsByName);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  

  useEffect(() => {
    getProducts();
  }, []);
  return loading ? (
    <Loading />
  ) : error ? (
    <p>{t("failed-to-load-products")}</p>
  ) : (
    <div className="scroll-bar">
      <div className="hidden md:block">
        <NavBar />
      </div>
      <div className="md:hidden">
        <MobileNavBar />
      </div>
      <section className="md:mt-36 mt-20 ">
        <div className="container mx-auto">
          <div className="text-center border-b-0">
            <h4 className="text-secondaryColor/70 text-3xl font-bold pt-10">
              {products[0]?.category.name}
            </h4>
          </div>
          <div className="mt-10 container flex justify-center">
            <div className="w-[90%]">
              <div className="grid grid-cols-12 gap-3">
                {products.length !== 0 ? (
                  products.map((product, index) => (
                    <Link
                      to={`/products/${product._id}`}
                      key={index}
                      className="bg-white shadow-md rounded-lg dark:bg-gray-800 dark:border-gray-700 col-span-12 md:col-span-4 flex justify-center items-center"
                    >
                      <div className="w-full">
                        <div className="flex justify-center">
                          <img
                            className="rounded-t-lg p-8 w-64 h-52 "
                            src={
                              product.imagesUrl !== null
                                ? `http://localhost:5000${product.imagesUrl[0]}`
                                : ""
                            }
                            alt={product.name}
                          />
                        </div>
                        <div className="px-5 pb-5">
                          <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white">
                            {product.name}
                          </h3>
                          <div className="flex items-center mt-2.5 mb-5">
                            <svg
                              className="w-5 h-5 text-yellow-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <svg
                              className="w-5 h-5 text-yellow-300"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
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
                  ))
                ) : (
                  <div className="col-span-12">
                    <div
                      className={`animate__animated animate__fadeIn flex justify-center items-center border border-secondaryColor/20 hover:shadow-lg transition-shadow duration-300 `}
                      style={{ animationDelay: `${1 * 0.1}s` }}
                    >
                      <div className="p-4 ">
                        <div className="text-info p-4 text-center">
                          <h3 className="text-lg text-gray-900 font-bold text-center">
                            {t("no-products")}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
