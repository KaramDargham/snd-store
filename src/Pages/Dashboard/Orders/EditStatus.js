import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import NotFound from "../../../Components/NotFound/NotFound";
import Loading from "../../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function EditStatus() {
  const id = window.location.pathname.split("/")[3];
  const [notFound, setNotFound] = useState(false);
  const [status, setStatus] = useState("");
  const cookie = Cookie();
  const accessToken = cookie.get("access");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
   const { t, i18n } = useTranslation();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `https://store-3t4b.onrender.com/orders/${id}`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: accessToken ? accessToken : "",
          },
        }
      );
      setLoading(false);
      nav("/dashboard/orders");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  console.log(status);
  return loading ? (
    <Loading />
  ) : notFound ? (
    <NotFound />
  ) : (
    <section className="w-full flex justify-center">
      <div className="card mx-auto md:w-1/2 w-full ">
        <div className="w-full p-6 ">
          <h4 className="text-2xl font-semibold mb-4 text-center text-secondaryColor">
            {t("edit-order-status")}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-sm font-medium pb-2 text-gray-700">
                {t("status")}
              </label>
              <select
                className="w-full py-2"
                value={status}
                name="status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">{t("pending")}</option>
                <option value="processing">{t("processing")}</option>
                <option value="delivered">{t("delivered")}</option>
                <option value="cancelled">{t("cancelled")}</option>
              </select>
            </div>
            <div className="mt-8">
              <button
                className="btn btn-primary w-full py-2 bg-primaryColor hover:bg-primaryColor/80 duration-300 transform text-white rounded-md"
                type="submit"
              >
                {t("edit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
