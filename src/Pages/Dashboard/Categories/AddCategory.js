import axios from "axios";
import React, { useState } from "react";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function AddCategory() {
  const [category, setCategory] = useState({
    name:"",
    url:"",
    image:null
  });
    const { t, i18n } = useTranslation();
  const cookie = Cookie();
  const accessToken = cookie.get("access");
  const [loading,setLoading] = useState(false)
  const nav = useNavigate()

  function fillForm(e){
    let name = e.target.name
    let value = e.target.value
    setCategory({...category,[name]:value})
    }
    function handleImageChange(e) {
        const file = e.target.files[0];
        setCategory({ ...category, image: file });
    }

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true)
    try{
   await axios.post("https://store-3t4b.onrender.com/products",category,{
    headers: {
        Authorization: accessToken ? accessToken : '',
        "Content-Type": 'multipart/form-data',
    },
   })
   setLoading(false)
     nav("/dashboard/products")
      
    }
    catch(err){
        console.log(err)
    }
    finally{
        setLoading(false)
    }
  }
  return (
    loading ?<Loading />:<section className="w-full flex justify-center">
      <div className="card mx-auto md:w-1/2 w-full">
        <div className="w-full p-6">
          <h4 className="text-2xl font-semibold mb-4 text-center text-secondaryColor">{t("add-category")}</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 w-full">
              <label className=" text-sm font-medium text-gray-700">
                {t("name")}
              </label>
              <input
                className="form-control w-full pl-2 h-8 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                name="name"
                type="text"
                onChange={fillForm}
                required
              />
           </div>
           <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t("page-url")}
              </label>
              <input
                className="form-control block w-full mt-1 h-8 pl-2 outline-none border-gray-300 rounded-md shadow-sm"
                type="text"
                name="url"
                onChange={fillForm}
                required
              />
           </div>
           <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t("image")}
              </label>
              <input
                className="form-control block w-full mt-1 h-8 pl-2 outline-none border-gray-300 rounded-md shadow-sm"
                type="file"
                name="image"
                onChange={handleImageChange}
                required
              />
           </div>
            <div className="mt-8">
              <button
                className="btn btn-primary w-full py-2 bg-primaryColor hover:bg-primaryColor/80 duration-300 transform text-white rounded-md"
                type="submit"
              >
                {t("add")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
