import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../Components/Website/NavBar";
import MobileNavBar from "../../Components/Website/MobileNavBar";
import { useTranslation } from "react-i18next";

export default function Categories(){
      const { t } = useTranslation();
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const [categories,setCategories] = useState([])
  async function getCategories() {
    try{
      let res = await axios.get("https://store-3t4b.onrender.com/categories");
      setCategories(res.data)
    }
    catch{
      setError(true)
    }
    finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    getCategories()
  },[])

    return loading?<p>loading...</p> : error ?<p>failed to load categories</p> :
    <div className="scroll-bar">
          <div className="hidden md:block">
            <NavBar />
          </div>
          <div className="md:hidden">
            <MobileNavBar />
          </div>
    <section className="md:mt-36 mt-24">
        <div className="container mx-auto">
          <div className="text-center border-b-0">
            <h4 className="text-secondaryColor/70 text-3xl font-bold pt-10">{t("categories")}</h4>
          </div>
          <div className="mt-10 flex justify-center">
            <ul className="grid md:grid-cols-4 gap-4 w-[90%]">
              {categories.map((category, index) => (
                <Link key={index} to={`/categories/${category._id}`}><li  className={`animate__animated animate__fadeIn flex justify-center items-center border border-secondaryColor/20 hover:shadow-lg transition-shadow duration-300`} style={{ animationDelay: `${index * 0.1}s` }} >
                  <div className="p-4">
                    <div className="image ">
                      <div className="flex justify-center">
                        <img src={`http://localhost:5000${category.imageUrl}`} alt={category.name} className="w-24 h-24 " />
                      </div>
                    </div>
                    <div className="text-info p-4 text-center">
                      <h3 className="text-sm text-gray-900 font-bold text-center">{category.name}</h3>
                    </div>
                  </div>
                </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </section>
      </div>
    }