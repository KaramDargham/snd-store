import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function EditUser() {
  const id = window.location.pathname.split("/")[3];
  const [user, setUser] = useState({});
  const cookie = Cookie();
  const accessToken = cookie.get("access");
  const [loading,setLoading] = useState(true)
  const nav = useNavigate()
   const { t, i18n } = useTranslation();
  async function getUser() {
    setLoading(true)
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/users", {
        headers: {
          Authorization: accessToken,
        },
      });
      let findUser = res.data.find((user,i)=> user._id === id)
      setUser(findUser)
    } catch(err) {
         console.log(err)
    }
    finally{
      setLoading(false)
    }
  }
  function fillForm(e){
    let name = e.target.name
    let value = e.target.value
    setUser({...user,[name]:value})
    }

  useEffect(()=>{
    getUser()
  },[])

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    try {
      let res = await axios.put(`https://store-3t4b.onrender.com/users/${id}`,user, {
        headers: {
          Authorization: accessToken,
        },
      });
      nav("/dashboard/accounts")
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    loading ?<Loading />:<section className="w-full flex justify-center">
      <div className="card mx-auto md:w-1/2 w-full">
        <div className="w-full p-6">
          <h4 className="text-2xl font-semibold mb-4 text-center text-secondaryColor">{t("edit-user")}</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 w-full">
              <label className=" text-sm font-medium text-gray-700">
                {t("name")}
              </label>
              <input
                className="form-control w-full pl-2 h-8 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                value={user.name}
                name="name"
                type="text"
                onChange={fillForm}
              />
           </div>
           <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <input
                className="form-control block w-full h-8 pl-2 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                value={user.email}
                type="text"
                name="email"
                onChange={fillForm}
              />
           </div>
           <div className="mb-3">
              <label className="block text-sm   font-medium text-gray-700">
                {t("role")}
              </label>
              <select
                className="form-control block w-full h-8 pl-2 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                name="role"
                onChange={fillForm}
              >
                <option value="customer">{t("customer")}</option>
                <option value="admin">{t("admin")}</option>
                </select>
           </div>
           <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t("phone")}
              </label>
              <input
                className="form-control block w-full mt-1 h-8 pl-2 outline-none border-gray-300 rounded-md shadow-sm"
                value={user.phone}
                type="text"
                name="phone"
                onChange={fillForm}
              />
           </div>
           <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t("location")}
              </label>
              <input
                className="form-control block w-full mt-1 h-8 pl-2 outline-none border-gray-300 rounded-md shadow-sm"
                value={user.location}
                type="text"
                name="location"
                onChange={fillForm}
              />
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
