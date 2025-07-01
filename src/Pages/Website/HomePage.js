import MobileNavBar from "../../Components/Website/MobileNavBar";
import NavBar from "../../Components/Website/NavBar";
import "swiper/css";
import Header1 from "../../images/Hero.jpg";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Loading from "../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  async function getCategories() {
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/categories");
      setCategories(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function getProducts() {
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/products");
      let slice = res.data.slice(0, 6);
      setProducts(slice);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="scroll-bar">
      <div className="hidden md:block">
        <NavBar />
      </div>
      <div className="md:hidden">
        <MobileNavBar />
      </div>
      <section className="flex justify-center">
        <div className="relative w-[100%]">
          <div className="w-full h-full md:mt-36 mt-20">
            <div>
              <div
                className="min-h-[65vh] rounded-lg flex justify-center"
                style={{
                  backgroundImage: `url(${Header1})`,
                  backgroundPosition: "top",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <div
                  className="flex md:justify-center justify-around md:flex-row flex-col"
                  dir="ltr"
                >
                  <div></div>
                  <div className="flex justify-center items-center w-full">
                    <div className="md:w-2/3 w-[90%]">
                      <h1 className="md:text-6xl text-4xl text-center text-gray-700 font-bold my-4">
                        {t("hero-title")}
                      </h1>
                      <div className="flex justify-center items-center">
                        <button className="bg-primaryColor text-center text-white text-xl font-semibold text-wrap mt-4 w-40 h-14 rounded-lg">
                          {t("shop-now")}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="flex md:flex-col md:gap-y-5 gap-x-8">
                      <Link
                        to="https://www.facebook.com/profile.php?id=61569974897926"
                        className="mdi mdi-facebook text-4xl md:text-6xl text-gray-700 hover:text-primaryColor transition-colors duration-300"
                      ></Link>
                      <i className="mdi mdi-whatsapp text-4xl md:text-6xl text-gray-700 hover:text-primaryColor transition-colors duration-300"></i>
                      <i className="mdi mdi-instagram text-4xl md:text-6xl text-gray-700 hover:text-primaryColor transition-colors duration-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {error ? (
        <p>{t("load-error")}</p>
      ) : (
        <section className="flex justify-center">
          <div className="container mx-auto">
            <div className="border-b-0">
              <h4 className="text-gray-700 text-center text-3xl font-bold pt-10">
                {t("popular-categories")}
              </h4>
            </div>
            <div className="mt-8 flex justify-center items-center">
              <ul className="grid grid-cols-2 md:grid-cols-8 gap-y-6 gap-x-2 w-[90%]">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={`md:animate__animated animate__fadeIn flex justify-center rounded-full md-h-36 md:w-36 items-center md:bg-secondaryColor/5 md:hover:shadow-lg transition-shadow duration-300`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link to={`/categories/${category._id}`}>
                      <div className="p-4 max-[768px]:bg-secondaryColor/5 max-[768px]:rounded-full max-[768px]:w-40 max-[768px]:h-40">
                        <div className="image">
                          <div className="flex justify-center">
                            <img
                              src={`http://localhost:5000${category.imageUrl}`}
                              alt={category.name}
                              className="md:w-14 md:h-14 w-20 h-20"
                            />
                          </div>
                        </div>
                        <div className="text-info p-4 text-center">
                          <h3 className="text-sm text-gray-900 font-bold text-center">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
      <section className="mt-8">
        <div className="container mx-auto">
          <div className="text-center border-b-0">
            <h4 className="text-gray-700 text-3xl font-bold pt-10">
              {t("popular-products")}
            </h4>
          </div>
          <div className="mt-10 container flex justify-center">
            <div className="w-[90%]">
              <div className="grid grid-cols-12 gap-3">
                {products.map((product, index) =>
                  index !== products.length - 1 ? (
                    <Link
                      to={`/products/${product._id}`}
                      className="bg-white shadow-md rounded-lg dark:bg-gray-800 dark:border-gray-700 col-span-12 md:col-span-4 flex justify-center items-center"
                      key={index}
                    >
                      <div className="w-full">
                        <div className="flex justify-center">
                          <img
                            className="rounded-t-lg p-8 w-64 h-52"
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
                  ) : (
                    <div className="w-full md:flex col-span-12 md:col-span-8 gap-3">
                      <Link
                        to={`/products/${product._id}`}
                        className="bg-white shadow-md rounded-lg dark:bg-gray-800 dark:border-gray-700 w-full  flex justify-center items-center"
                        key={index}
                      >
                        <div className="w-full">
                          <div className="flex justify-center">
                            <img
                              className="rounded-t-lg p-8 w-64 h-52"
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
                      <Link
                        to={`/shop`}
                        className="bg-white shadow-md rounded-lg w-full md:mt-0 mt-3 pb-3 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-evenly items-center"
                        key={index}
                      >
                        <div className="w-full">
                          <div className="flex justify-center">
                            <span className="mdi mdi-storefront-plus text-[100px] text-primaryColor transition duration-200 hover:text-neutral-500"></span>
                          </div>
                        </div>
                        <div className="flex justify-center pt-5">
                          <h5 className="text-xl">{t("shop-more")}</h5>
                        </div>
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="pt-24"></div>
    </div>
  );
}
