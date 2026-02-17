import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: [],
  });
  const [categories, setCategories] = useState([]);
  const cookie = Cookie();
  const accessToken = cookie.get("access");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
   const { t, i18n } = useTranslation();

  async function getCategories() {
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/categories", {
        headers: {
          Authorization: accessToken,
        },
      });
      const formattedCategories = res.data.map((category) => ({
        id: category._id,
        name: category.name,
      }));

      setCategories(formattedCategories);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
  if (categories.length > 0 && product.category === "") {
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: categories[0].id,
    }));
  }
}, [categories]);

  function fillForm(e) {
    let name = e.target.name;
    let value = e.target.value;
    setProduct({ ...product, [name]: value });
  }
  function handleImageChange(e) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 4) {
      alert(t('max_4_images')); // translation key
      return;
    }
    setProduct({ ...product, image: files });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("category", product.category);
    formData.append("stock", product.stock);
    for (let i = 0; i < product.image.length; i++) {
      formData.append("images", product.image[i]);
    }

    try {
      await axios.post("https://store-3t4b.onrender.com/products", formData, {
        headers: {
          Authorization: accessToken ? accessToken : "",
          // do not set Content-Type manually; axios will add the correct
          // multipart boundary automatically
        },
      });
      setLoading(false);
      nav("/dashboard/products");
    } catch (err) {
      console.log('submit error', err);
      if (err.response) {
        console.log('server response', err.response.data);
        const msg = err.response.data.error || 'Server error';
        alert(msg + (err.response.data.stack ? '\n' + err.response.data.stack : ''));
      }
      setLoading(false);
    }
  }
  console.log(product);
  return loading ? (
    <Loading />
  ) : (
    <section className="w-full flex justify-center">
      <div className="card mx-auto md:w-1/2 w-full">
        <div className="w-full p-6">
          <h4 className="text-2xl font-semibold mb-4 text-center text-secondaryColor">
            {t("add-product")}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 w-full">
              <label className=" text-sm font-medium text-gray-700">{t("name")}</label>
              <input
                className="form-control w-full pl-2 h-8 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                name="name"
                type="text"
                onChange={fillForm}
                required
              />
            </div>
            <div className="mb-3 w-full">
              <label className=" text-sm font-medium text-gray-700">
                {t("description")}
              </label>
              <input
                className="form-control w-full pl-2 h-8 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                name="description"
                type="text"
                onChange={fillForm}
                required
              />
            </div>
            <div className="mb-3 w-full">
              <label className=" text-sm font-medium text-gray-700">
                {t("price")}
              </label>
              <input
                className="form-control w-full pl-2 h-8 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                name="price"
                type="text"
                onChange={fillForm}
                required
              />
            </div>
            <div className="mb-3 w-full">
              <label className=" text-sm font-medium text-gray-700">
                {t("stock")}
              </label>
              <input
                className="form-control w-full pl-2 h-8 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                name="stock"
                type="number"
                onChange={fillForm}
                required
              />
            </div>
            <div className="mb-3 w-full">
              <label className=" text-sm font-medium text-gray-700">
                {t("category")}
              </label>
              <select
                name="category"
                value={product.category}
                onChange={fillForm}
                className="form-control block w-full mt-1 my-5 h-8 pl-2 outline-none border-gray-300 rounded-md shadow-sm"
              >
                {categories.map((category, i) => (
                  <option key={i} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Images (Up to 4)
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

              {product.image.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {Array.from(product.image).map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  ))}
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
