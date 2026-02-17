import axios from "axios";
import { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { Link } from "react-router-dom";
import Loading from "../../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function ShowProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const cookie = Cookie();
  const accessToken = cookie.get("access");
   const { t, i18n } = useTranslation();

  async function getCategories() {
    setLoading(true);
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/products", {
        headers: {
          Authorization: accessToken,
        },
      });
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  async function deleteCategory(id) {
    setLoading(true)
     try{
      let res = await axios.delete(`https://store-3t4b.onrender.com/products/${id}`, {
        headers: {
          Authorization: accessToken,
        },
      });
      let deleteFromArray = products.filter((category,i)=>category._id!== id)
       setProducts(deleteFromArray)
     }
     catch(e){
      console.log(e)
     }
     finally{
       setLoading(false)
     }
  }

  useEffect(() => {
    getCategories();
  }, []);
  const API_BASE = "https://store-3t4b.onrender.com";
  const resolveImageUrl = (image) => {
    if (!image) return "";
    return /^https?:\/\//i.test(image) ? image : `${API_BASE}${image}`;
  };
  return loading ? (
    <Loading />
  ) : (
    <div className="p-6 bg-white shadow-md rounded-lg w-full  h-full">
      <div className="w-full flex justify-between  md:flex-row flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("products")}</h2>
      <Link to="/dashboard/addProduct" className="w-28 h-8 bg-secondaryColor flex justify-center items-center rounded-md text-lg text-center text-white">{t("add")} <span class="mdi mdi-plus pt-1"></span></Link>
      </div>

      <div className="overflow-x-auto md:flex hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3 text-start border-b">{t("image")}</th>
              <th className="p-3 text-start border-b">{t("name")}</th>
              <th className="p-3 text-start border-b">{t("category")}</th>
              <th className="p-3 text-start border-b">{t("price")}</th>
              <th className="p-3 text-start border-b">{t("stock")}</th>
              <th className="p-3 border-b text-center">{t("action")}</th>
            </tr>
          </thead>
         
          <tbody>
            {products.length!==0 &&products.map((product,i)=><tr className="border-b hover:bg-gray-50 ">
              <td className="p-3">
                <img src={product.imagesUrl && product.imagesUrl.length>0 ? resolveImageUrl(product.imagesUrl[0]) : ""} alt={product.name} className="w-8" />
              </td>
              <td className="p-3">
                {product.name}
              </td>
              <td className="p-3">
                {product.category.name}
              </td>
              <td className="p-3">
                {product.price}
              </td>
              <td className="p-3">
                {product.stock}
              </td>
              <td className="p-3 text-center">
                <Link to={`/dashboard/products/${product._id}`} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                  {t("edit")}
                </Link>
                <button onClick={()=>deleteCategory(product._id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 ltr:ml-2 rtl:mr-2">
                  {t("delete")}
                </button>
              </td>
            </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className=" md:hidden flex h-full justify-center items-center pb-16">
        <div className="w-full flex justify-center items-center">
          <div className="">
            {products.length!==0 &&products.map((product,i)=><div className="border-b hover:bg-gray-50 ">
              <img src={product.imagesUrl && product.imagesUrl.length>0 ? resolveImageUrl(product.imagesUrl[0]) : ""} alt={product.name} className="w-52 pt-5"/>
              <h3 className="p-3 mt-3">
               {t("name")}: {product.name}
              </h3>
              <h3 className="p-3">
               {t("category")}: {product.category.name}
              </h3>
              <h3 className="p-3">
               {t("price")}: {product.price}
              </h3>
              <h3 className="p-3">
               {t("stock")}: {product.stock}
              </h3>
              <h3 className="p-3 text-center">
                <Link to={`/dashboard/products/${product._id}`} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                  {t("edit")}
                </Link>
                <button onClick={()=>deleteCategory(product._id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 ltr:ml-2 rtl:mr-2">
                  {t("delete")}
                </button>
              </h3>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
    
  );
}
