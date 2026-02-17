import axios from "axios";
import { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { Link } from "react-router-dom";
import Loading from "../../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function ShowCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
  const cookie = Cookie();
  const accessToken = cookie.get("access");

  async function getCategories() {
    setLoading(true);
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/categories", {
        headers: {
          Authorization: accessToken,
        },
      });
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  async function deleteCategory(id) {
    setLoading(true)
     try{
      let res = await axios.delete(`https://store-3t4b.onrender.com/categories/${id}`, {
        headers: {
          Authorization: accessToken,
        },
      });
      let deleteFromArray = categories.filter((category,i)=>category._id!== id)
       setCategories(deleteFromArray)
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
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("categories")}</h2>
      <Link to="/dashboard/addCategory" className="w-28 h-8 bg-secondaryColor flex justify-center items-center rounded-md text-lg text-center text-white">{t("add")} <span class="mdi mdi-plus pt-1"></span></Link>
      </div>

      <div className="overflow-x-auto md:flex hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3 text-start border-b">{t("image")}</th>
              <th className="p-3 text-start border-b">{t("name")}</th>
              <th className="p-3 text-start border-b">{t("page-url")}</th>
              <th className="p-3 border-b text-center">{t("action")}</th>
            </tr>
          </thead>
         
          <tbody>
            {categories.length!==0 &&categories.map((category,i)=><tr className="border-b hover:bg-gray-50 ">
              <td className="p-3">
                        <img src={resolveImageUrl(category.imageUrl)} alt={category.name} className="w-8" />
              </td>
              <td className="p-3">
                {category.name}
              </td>
              <td className="p-3">
                {category.url}
              </td>
              <td className="p-3 text-center">
                <Link to={`/dashboard/categories/${category._id}`} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                  {t("edit")}
                </Link>
                <button onClick={()=>deleteCategory(category._id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 ltr:ml-2 rtl:mr-2">
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
            {categories.length!==0 &&categories.map((category,i)=><div className="border-b hover:bg-gray-50 ">
              <h3 className="p-3">
               Name: {category.name}
              </h3>
              <h3 className="p-3">
               Page Url: {category.url}
              </h3>
              <img src={resolveImageUrl(category.imageUrl)} alt={category.name} className="w-20"/>
              <h3 className="p-3 text-center">
                <Link to={`/dashboard/categories/${category._id}`} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                  Edit
                </Link>
                <button onClick={()=>deleteCategory(category._id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 ltr:ml-2 rtl:mr-2">
                  Delete
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
