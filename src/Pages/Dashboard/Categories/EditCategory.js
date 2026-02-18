import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import NotFound from "../../../Components/NotFound/NotFound"
import Loading from "../../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function EditCategory() {
  const id = window.location.pathname.split("/")[3];
  const [category, setCategory] = useState({});
  const [notFound,setNotFound] = useState(false)
  const cookie = Cookie();
  const accessToken = cookie.get("access");
  const [loading,setLoading] = useState(true)
  const nav = useNavigate()
    const { t, i18n } = useTranslation();

 async function getCategory(){
    setLoading(true)
     try{
      let res = await axios.get(`https://store-3t4b.onrender.com/categories/${id}`)
      setCategory(res.data)
     }
     catch{
        setNotFound(true)
     }
     finally{
        setLoading(false)
     }
  }
  useEffect(()=>{
    getCategory()
  },[])
  const API_BASE = "https://store-3t4b.onrender.com";
  const resolveImageUrl = (image) => {
    if (!image) return "";
    return /^https?:\/\//i.test(image) ? image : `${API_BASE}${image}`;
  };
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
      const formData = new FormData();
      if (category.name) formData.append('name', category.name);
      if (category.url) formData.append('url', category.url);
      if (category.image && category.image instanceof File) formData.append('image', category.image);

      await axios.put(`https://store-3t4b.onrender.com/categories/${id}`, formData, {
        headers: {
          Authorization: accessToken ? accessToken : '',
        },
      });
      setLoading(false);
      nav("/dashboard/categories");
      
    }
    catch(err){
        console.log(err)
    }
    finally{
        setLoading(false)
    }
  }
  return (
    loading ?<Loading />:notFound ? <NotFound />:<section className="w-full flex justify-center">
      <div className="card mx-auto md:w-1/2 w-full ">
        <div className="w-full p-6 ">
          <h4 className="text-2xl font-semibold mb-4 text-center text-secondaryColor">{t("edit-category")}</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 w-full">
                <img src={resolveImageUrl(category.imageUrl)} className="w-1/2" alt={category.name} />
              <label className=" text-sm font-medium text-gray-700">
                {t("name")}
              </label>
              <input
                className="form-control w-full pl-2 h-8 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                name="name"
                type="text"
                value={category.name}
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
                value={category.url}
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
