import axios from "axios";
import { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import Loading from "../../../Components/Loading/Loading";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ShowOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const cookie = Cookie();
   const { t, i18n } = useTranslation();
  const accessToken = cookie.get("access");

  async function getOrders() {
    setLoading(true);
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/orders", {
        headers: {
          Authorization: accessToken,
        },
      });
      setOrders(res.data.reverse());
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  async function deleteCategory(id) {
    setLoading(true);
    try {
      await axios.delete(`https://store-3t4b.onrender.com/orders/${id}`, {
        headers: {
          Authorization: accessToken,
        },
      });
      let deleteFromArray = orders.filter((order, i) => order._id !== id);
      setOrders(deleteFromArray);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

   function formatDate(date) {
    let newdate = new Date(date);

    let day = newdate.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    let month = newdate.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let year = newdate.getFullYear();
    
    let hours = newdate.getHours();
    if (hours < 10) {
        hours = "0" + hours;
    }
    let minutes = newdate.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    
    return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
}
  return loading ? (
    <Loading />
  ) : (
    <div className="p-6 bg-white shadow-md rounded-lg w-full  h-full">
      <div className="w-full flex justify-between  md:flex-row flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("orders")}</h2>
      </div>

      <div className="overflow-x-auto md:flex hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3 text-start border-b border-secondaryColor">
                {t("products")}
              </th>
              <th className="p-3 text-start border-b border-secondaryColor">
                {t("user-info")}
              </th>
              <th className="p-3 text-start border-b border-secondaryColor">
                {t("total")}
              </th>
              <th className="p-3 text-start border-b border-secondaryColor">
                {t("order-date")}
              </th>
              <th className="p-3 text-start border-b border-secondaryColor">
                {t("status")}
              </th>
              <th className="p-3 border-b text-center border-secondaryColor">
                {t("action")}
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 &&
              orders.map((order, i) => (
                <tr className="border-b hover:bg-gray-50  ">
                  <td className="p-3 border border-secondaryColor">
                    {order.products?.map((product) => (
                      <div className="flex justify-between">
                        <p>{product.name}</p>
                        <p>{product.stock}</p>
                      </div>
                    ))}
                  </td>
                  <td className="p-3 border border-secondaryColor">
                    <p>{t("name")} :{order.user.name}</p>
                    <p>{t("email")} :{order.user.email}</p>
                    <p>{t("phone")} :+{order.user.phone}</p>
                    <p>{t("location")} :{order.location}</p>
                  </td>
                  <td className="p-3 border border-secondaryColor ">
                    {order.totalAmount}$
                  </td>
                  <td className="p-3 border border-secondaryColor">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="p-3 border border-secondaryColor">
                    {order.status} {order.status !=='delivered' && <Link to={`/dashboard/orders/${order._id}`} className="mdi mdi-pencil-box text-lg px-1 text-primaryColor"></Link>}
                  </td>
                  <td className="p-3 text-center border border-secondaryColor">
                    <button
                      onClick={() => deleteCategory(order._id)}
                      className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 ml-2"
                    >
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
       <div className=" md:hidden flex h-full w-full justify-center items-center pb-16">
              <div className="w-full flex justify-center items-center">
                <div className="w-full">
                  {orders.length !== 0 &&
                    orders.map((order, i) => (
                      <div className="border-b hover:bg-gray-50 border-black">
                        <h3 className="p-3 mt-3">
                          <h2 className="border-b border-gray-200 text-center">{t("products")}</h2>
                          {order.products?.map((product) => (
                            <div className="flex justify-between">
                              <p>{product.name}</p>
                              <p>{product.stock}</p>
                            </div>
                          ))}
                        </h3>
                        <h3 className="p-3">
                         <h2 className="border-b border-gray-200 text-center">{t("user-info")}</h2> <p>{t("name")} :{order.user.name}</p>
                          <p>{t("email")} :{order.user.email}</p>
                          <p>{t("phone")} :+{order.user.phone}</p>
                          <p>{t("location")} :{order.location}</p>
                        </h3>
                        <h3 className="p-3">
                          <h2 className="border-b border-gray-200 text-center">{t("total")}</h2> {order.totalAmount}$
                        </h3>
                        <h3 className="p-3"><h2 className="border-b border-gray-200 text-center">{t("total")}</h2> {formatDate(order.orderDate)}</h3>
                        <h3 className="p-3"><h2 className="border-b border-gray-200 text-center">{t("status")}</h2> {order.status} {order.status !=='delivered' && <Link to={`/dashboard/orders/${order._id}`} className="mdi mdi-pencil-box text-lg px-1 text-primaryColor"></Link>}</h3>
                        <h3 className="p-3 text-center">
                          <button
                            onClick={() => deleteCategory(order._id)}
                            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 ml-2"
                          >
                            {t("delete")}
                          </button>
                        </h3>
                      </div>
                    ))}
                </div>
              </div>
            </div>
    </div>
  );
}
