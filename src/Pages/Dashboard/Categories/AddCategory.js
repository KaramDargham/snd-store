import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function AddCategory() {
  const [category, setCategory] = useState({
    name: "",
    url: "",
    image: [],
  });
  const [preview, setPreview] = useState([]);
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
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 4) {
          alert(t('max_4_images'));
          return;
        }
        setCategory({ ...category, image: files });
        // create previews
        const urls = files.map((f) => URL.createObjectURL(f));
        setPreview(urls);
        }

  useEffect(() => {
    return () => {
      preview.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [preview]);

  // cleanup preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true)
    try{
      const formData = new FormData();
      formData.append("name", category.name);
      formData.append("url", category.url);
      if (category.image) formData.append("image", category.image);

      await axios.post("https://store-3t4b.onrender.com/categories", formData, {
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
    loading ?<Loading />:<section className="w-full flex justify-center">
      <div className="card mx-auto md:w-1/2 w-full">
        <div className="w-full p-6">
          <h4 className="text-2xl font-semibold mb-4 text-center text-secondaryColor">{t("add-category")}</h4>
          <form onSubmit={handleSubmit}>
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
              {preview && (
                <div className="mt-4">
                  <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded-md" />
                </div>
              )}
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
