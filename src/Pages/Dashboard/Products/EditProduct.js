import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import NotFound from "../../../Components/NotFound/NotFound"
import Loading from "../../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function EditProduct() {
  const id = window.location.pathname.split("/")[3];
  const [product, setProduct] = useState({});
  const [notFound,setNotFound] = useState(false)
  const cookie = Cookie();
  const accessToken = cookie.get("access");
  const [loading,setLoading] = useState(true)
  const nav = useNavigate()
   const { t, i18n } = useTranslation();

 async function getProduct(){
    setLoading(true)
     try{
        let res = await axios.get(`https://store-3t4b.onrender.com/products/${id}`)
        setProduct(res.data)
     }
     catch{
        setNotFound(true)
     }
     finally{
        setLoading(false)
     }
  }
  useEffect(()=>{
    getProduct()
  },[])
  function fillForm(e){
    let name = e.target.name
    let value = e.target.value
    setProduct({...product,[name]:value})
    }
    function handleImageChange(e) {
        const file = e.target.files[0];
        setProduct({ ...product, image: file });
    }

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("category", product.category);
    formData.append("stock", product.stock);
    for (let i = 0; i < product.image.length; i++) {
      formData.append("images", product.image[i]);
    }
    try{
   await axios.put(`https://store-3t4b.onrender.com/products/${id}`,formData,{
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
    loading ?<Loading />:notFound ? <NotFound />:<section className="w-full flex justify-center">
      <div className="card mx-auto md:w-1/2 w-full ">
        <div className="w-full p-6 ">
          <h4 className="text-2xl font-semibold mb-4 text-center text-secondaryColor">{t("edit-product")}</h4>
          <form onSubmit={handleSubmit} className="flex justify-center items-center">
            <div className="max-w-[400px]">
              <div className="">
              <img src={product.imagesUrl !== null? `https://store-3t4b.onrender.com${product.imagesUrl[0]}`:""} className="w-full" alt={product.name} />
              </div>
            <div className="mb-3 w-full">
 
              <label className=" text-sm font-medium text-gray-700">
                {t("name")}
              </label>
              <input
                className="form-control w-full pl-2 h-8 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                name="name"
                type="text"
                value={product.name}
                onChange={fillForm}
                required
              />
           </div>
           <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t("category")}
              </label>
              <input
                className="form-control block w-full mt-1 h-8 pl-2 outline-none border-gray-300 rounded-md shadow-sm"
                type="text"
                name="category"
                value={product.category.name}
                onChange={fillForm}
                required
              />
           </div>
           <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t("price")}
              </label>
              <input
                className="form-control block w-full mt-1 h-8 pl-2 outline-none border-gray-300 rounded-md shadow-sm"
                type="text"
                name="category"
                value={product.price}
                onChange={fillForm}
                required
              />
           </div>
           <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t("stock")}
              </label>
              <input
                className="form-control block w-full mt-1 h-8 pl-2 outline-none border-gray-300 rounded-md shadow-sm"
                type="text"
                name="category"
                value={product.stock}
                onChange={fillForm}
                required
              />
           </div>
           <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t("images")}
              </label>
              <input
                className="form-control block w-full mt-1 h-8 pl-2 outline-none border-gray-300 rounded-md shadow-sm"
                type="file"
                name="image"
                onChange={handleImageChange}
                multiple // Allow multiple selection
                accept="image/*" // Only accept images
                required
              />
              {product.image.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  {t("selected")}: {product.image.length} {t("files")}
                </div>
              )}
           </div>
            <div className="mt-8">
              <button
                className="btn btn-primary w-full py-2 bg-primaryColor hover:bg-primaryColor/80 duration-300 transform text-white rounded-md"
                type="submit"
              >
                {t("edit")}
              </button>
            </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
