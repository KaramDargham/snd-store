import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import NotFound from "../../../Components/NotFound/NotFound";
import Loading from "../../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function EditProduct() {
  const id = window.location.pathname.split("/")[3];
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: { name: "", _id: "" },
    stock: "",
    imagesUrl: [],
    image: [],
  });
  const [categories, setCategories] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const cookie = Cookie();
  const accessToken = cookie.get("access");
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const { t } = useTranslation();

  async function getCategories() {
    try {
      const res = await axios.get("https://store-3t4b.onrender.com/categories", {
        headers: {
          Authorization: accessToken,
        },
      });
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getProduct() {
    setLoading(true);
    try {
      const res = await axios.get(`https://store-3t4b.onrender.com/products/${id}`);
      setProduct({
        ...res.data,
        image: [], // Initialize new images as empty array
      });
      getCategories();
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduct();
  }, []);
  const API_BASE = "https://store-3t4b.onrender.com";
  const resolveImageUrl = (image) => {
    if (!image) return "";
    return /^https?:\/\//i.test(image) ? image : `${API_BASE}${image}`;
  };

  function fillForm(e) {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  }

  function handleImageChange(e) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setProduct({ ...product, image: files });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("category", product.category._id);
    formData.append("stock", product.stock);
    
    // Append new images if any
    product.image.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.put(`https://store-3t4b.onrender.com/products/${id}`, formData, {
        headers: {
          Authorization: accessToken ? accessToken : "",
          "Content-Type": "multipart/form-data",
        },
      });
      nav("/dashboard/products");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;
  if (notFound) return <NotFound />;

  return (
    <section className="w-full flex justify-center">
      <div className="card mx-auto md:w-1/2 w-full">
        <div className="w-full p-6">
          <h4 className="text-2xl font-semibold mb-4 text-center text-secondaryColor">
            {t("edit-product")}
          </h4>
          <form onSubmit={handleSubmit}>
            {/* Existing Image Preview */}
            {product.imagesUrl?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {product.imagesUrl.map((url, index) => (
                  <img
                    key={index}
                    src={resolveImageUrl(url)}
                    alt={`Product ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            )}

            <div className="mb-3 w-full">
              <label className="text-sm font-medium text-gray-700">
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

            <div className="mb-3 w-full">
              <label className="text-sm font-medium text-gray-700">
                {t("description")}
              </label>
              <input
                className="form-control w-full pl-2 h-8 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                name="description"
                type="text"
                value={product.description}
                onChange={fillForm}
                required
              />
            </div>

            <div className="mb-3 w-full">
              <label className="text-sm font-medium text-gray-700">
                {t("price")}
              </label>
              <input
                className="form-control w-full pl-2 h-8 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                name="price"
                type="text"
                value={product.price}
                onChange={fillForm}
                required
              />
            </div>

            <div className="mb-3 w-full">
              <label className="text-sm font-medium text-gray-700">
                {t("stock")}
              </label>
              <input
                className="form-control w-full pl-2 h-8 mt-1 outline-none border-gray-300 rounded-md shadow-sm"
                name="stock"
                type="number"
                value={product.stock}
                onChange={fillForm}
                required
              />
            </div>

            <div className="mb-3 w-full">
              <label className="text-sm font-medium text-gray-700">
                {t("category")}
              </label>
              <select
                name="category"
                value={product.category._id}
                onChange={(e) => setProduct({
                  ...product,
                  category: {
                    ...product.category,
                    _id: e.target.value
                  }
                })}
                className="form-control block w-full mt-1 h-8 pl-2 outline-none border-gray-300 rounded-md shadow-sm"
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {t("new-images")} (Optional)
              </label>
              <input
                className="form-control block w-full mt-1 h-8 pl-2 outline-none border-gray-300 rounded-md shadow-sm"
                type="file"
                name="image"
                onChange={handleImageChange}
                multiple
                accept="image/*"
              />
              {product.image?.length > 0 && (
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
                {t("save-changes")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
