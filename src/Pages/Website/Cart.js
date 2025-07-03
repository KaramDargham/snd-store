import axios from "axios";
import Cookie from "cookie-universal";
import { useEffect, useState } from "react";
import Loading from "../../Components/Loading/Loading";
import NavBar from "../../Components/Website/NavBar";
import MobileNavBar from "../../Components/Website/MobileNavBar";
import Popup from "reactjs-popup";
import "./Cart.css";
import Syriatel from "../../images/syriatel.jpg";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const cookie = Cookie();
  const access = cookie.get("access");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [internalPay, setInternalPay] = useState(null);
    const [location, setLocation] = useState("");
    const locationFromLocalStorage = window.localStorage.getItem("location");
    const [date, setDate] = useState("");
     const { t, i18n } = useTranslation();

  async function getUserCart() {
    try {
      const res = await axios.get("https://store-3t4b.onrender.com/cart", {
        headers: {
          Authorization: access ? access : "",
        },
      });
      setCartItems(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  function updateQuantity(itemId, newQuantity) {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId
          ? { ...item, stock: Math.max(1, newQuantity) }
          : item
      )
    );
  }

  function incrementQuantity(itemId) {
    updateQuantity(
      itemId,
      cartItems.find((item) => item._id === itemId).stock + 1
    );
  }

  function decrementQuantity(itemId) {
    const item = cartItems.find((item) => item._id === itemId);
    if (item.stock > 1) {
      updateQuantity(itemId, item.stock - 1);
    }
  }

  useEffect(() => {
    getUserCart();
  }, []);
  async function deleteItem(id) {
    setLoading(true);
    try {
      await axios.delete(`https://store-3t4b.onrender.com/cart/${id}`, {
        headers: {
          Authorization: access ? access : "",
        },
      });
      // Remove the item from local state
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
    }
  }
  
  const getCartTotal = () =>
    cartItems
      .reduce((total, item) => total + item.price * item.stock, 0)
      .toFixed(2);

  const purchaseOrder = async (total) => {
  setLoading(true);

  // Corrected: Use 'product' instead of 'id' to match the Order model
  const products = cartItems.map((item) => ({
    product: item._id, // Key must be 'product' (not 'id')
    name: item.name,
    stock: item.stock,
    price: item.price,
  }));

  try {
    const orderData = {
      products, // Now matches the schema
      totalAmount: total,
      location,
      orderDate: date,
    };

    const response = await axios.post('https://store-3t4b.onrender.com/orders', orderData, {
      headers: {
        Authorization: access ? access : "",
      },
    });

    if (response.status === 201) {
       try {
        await axios.delete('https://store-3t4b.onrender.com/cart/delete/clear', {
          headers: {
            Authorization: access ? access : "",
          },
        });
      } catch {

      }

      setCartItems([]);
      setLocation("");
      setDate("");
    }
  } catch (error) {
    console.error("Order error:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

  return loading ? (
    <Loading />
  ) : (
    <div className="scroll-bar bg-[#edf2f7]">
      <div className="hidden md:block pb-36">
        <NavBar />
      </div>
      <div className="md:hidden pb-10">
        <MobileNavBar />
      </div>
      <div
        className="h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "#edf2f7" }}
      >
        <div className="w-full">
          <div className="h-screen bg-white pt-10">
            <h4 className="text-secondaryColor/70 text-3xl text-center font-bold pt-2 mb-10">
              {t("cart")}
            </h4>
            <div className="mx-auto max-w-5xl gap-x-2 justify-center px-6 md:flex md:space-x-6 xl:px-0">
              <div className="rounded-lg md:w-2/3">
                {cartItems.length !== 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="justify-between rounded-lg bg-gray-50 mb-2 p-6 shadow-md sm:flex sm:justify-start"
                    >
                      <img
                        src={`https://store-3t4b.onrender.com{item.imageUrl}`}
                        alt="product-image"
                        className="w-32 rounded-lg sm:w-40"
                      />
                      <div className="sm:ltr:ml-4 sm:rtl:mr-2 sm:flex sm:w-full sm:justify-between">
                        <div className="mt-5 sm:mt-0">
                          <h2 className="text-lg font-bold text-gray-900">
                            {item.name}
                          </h2>
                          <p className="mt-1 text-xs text-gray-700">
                            ${item.price}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                          <div className="flex items-center border-gray-100">
                            <span
                              onClick={() => decrementQuantity(item._id)}
                              className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                            >
                              -
                            </span>
                            <input
                              className="h-8 w-8 border bg-white text-center text-xs outline-none"
                              type="number"
                              value={item.stock}
                              min="1"
                              onChange={(e) =>
                                updateQuantity(
                                  item._id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                            />
                            <span
                              onClick={() => incrementQuantity(item._id)}
                              className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                            >
                              +
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <p className="text-sm">
                              ${(item.price * item.stock).toFixed(2)}
                            </p>
                            <button onClick={() => deleteItem(item._id)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-xl font-semibold pt-44">
                   {t("cart-empty")}
                  </div>
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                  <hr className="my-4" />
                  <div className="flex justify-between">
                    <p className="text-lg font-bold">{t("total")}</p>
                    <div className="">
                      <p className="mb-1 text-lg font-bold">
                        $
                        {cartItems
                          .reduce(
                            (sum, item) => sum + item.price * item.stock,
                            0
                          )
                          .toFixed(2)}{" "}
                        USD
                      </p>
                    </div>
                  </div>
                  <Popup
                    trigger={
                      <button className="mt-6 w-full duration-300 rounded-md bg-primaryColor py-1.5 font-medium text-blue-50 hover:bg-blue-600">
                       {t("purchase")}
                      </button>
                    }
                    modal
                    nested
                  >
                    {(close) => (
                      <div className="flex justify-center">
                        {internalPay ? (
                          <div className="p-5 md:w-full w-[90%] bg-gray-300 rounded-lg">
                            <button
                              className="close text-red-700"
                              onClick={close}
                            >
                              &times;
                            </button>
                            <div className="header text-center font-semibold text-xl">
                              {t("enter-location-date")}
                            </div>
                            <div className="content">
                              <input
                                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-primaryColor outline-none placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                type="datetime-local"
                                name="date"
                                onChange={(e) => {
                                  const localDate = new Date(e.target.value);
                                  const utcDate = new Date(
                                    localDate.getTime() -
                                      localDate.getTimezoneOffset() * 60000
                                  );
                                  setDate(utcDate.toISOString()); // Convert to UTC format before sending
                                }}
                                id="date"
                                placeholder={t("date")}
                                required
                              />
                              <input
                                className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-primaryColor outline-none placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                type="text"
                                name="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                id="location"
                                placeholder={t("location")}
                                required
                              />
                            </div>
                            <div className="actions mt-8 flex justify-center gap-x-5">
                              <button
                                onClick={() =>
                                  purchaseOrder(
                                    getCartTotal()
                                  )
                                }
                                className="px-8 py-3 mt-3 bg-primaryColor text-white text-xs font-bold uppercase rounded hover:bg-secondaryColor focus:outline-none focus:bg-gray-700"
                              >
                                {t("submit")}
                              </button>
                              <button
                                className="bg-gray-700 px-8 py-3 mt-3 text-white text-xs font-bold uppercase rounded"
                                onClick={() => {
                                  close();
                                }}
                              >
                                {t("close")}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-5 md:w-full w-[90%] bg-gray-300 rounded-lg">
                            <button
                              className="close text-red-700"
                              onClick={close}
                            >
                              &times;
                            </button>
                            <div className="header text-center font-semibold text-xl">
                              {t("payment-method")}
                            </div>
                            <div className="flex md:flex-row flex-col justify-center items-center md:justify-evenly pt-8 gap-4">
                              <button>
                                <img
                                  src={Syriatel}
                                  alt="syriatel-cash"
                                  className="w-64 h-64 rounded-lg"
                                />
                              </button>
                              <button onClick={() => setInternalPay(true)}>
                                <div className="w-64 h-64 bg-gray-200 flex justify-center items-center  rounded-lg">
                                  <div>
                                    <span class="mdi mdi-account-cash text-6xl text-secondaryColor"></span>
                                    <h2 className="pt-2">
                                      {t("payment-on-delivery")}
                                    </h2>
                                  </div>
                                </div>
                              </button>
                            </div>
                            <div className="actions mt-8 flex justify-center gap-x-5">
                              <button
                                className="bg-gray-700 px-8 py-3 mt-3 text-white text-xs font-bold uppercase rounded"
                                onClick={() => {
                                  close();
                                }}
                              >
                                {t("close")}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Popup>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
