import axios from "axios";
import { useEffect, useState } from "react";
import Cookie from "cookie-universal";
import { Link } from "react-router-dom";
import Loading from "../../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";

export default function Accounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const cookie = Cookie();
  const accessToken = cookie.get("access");
   const { t, i18n } = useTranslation();

  async function getUsers() {
    setLoading(true);
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/users", {
        headers: {
          Authorization: accessToken,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  async function deleteUser(id) {
    setLoading(true)
     try{
      let res = await axios.delete(`https://store-3t4b.onrender.com/users/${id}`, {
        headers: {
          Authorization: accessToken,
        },
      });
      let deleteFromArray = users.filter((user,i)=>user._id!== id)
       setUsers(deleteFromArray)
     }
     catch(e){
      console.log(e)
     }
     finally{
       setLoading(false)
     }
  }

  useEffect(() => {
    getUsers();
  }, []);
  return loading ? (
    <Loading />
  ) : (
    <div className="p-6 bg-white shadow-md rounded-lg w-full h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t("accounts")}</h2>

      <div className="overflow-x-auto md:flex hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3 text-start border-b">{t("name")}</th>
              <th className="p-3 text-start border-b">{t("email")}</th>
              <th className="p-3 text-start border-b">{t("role")}</th>
              <th className="p-3 text-start border-b">{t("phone")}</th>
              <th className="p-3 text-start border-b">{t("location")}</th>
              <th className="p-3 border-b text-center">{t("action")}</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user,i)=><tr className="border-b hover:bg-gray-50 ">
              <td className="p-3">
                {user.name}
              </td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3">{user.phone}</td>
              <td className="p-3">{user.location}</td>
              <td className="p-3 text-center">
                <Link to={`/dashboard/accounts/${user._id}`} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                  {t("edit")}
                </Link>
                <button onClick={()=>deleteUser(user._id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 ltr:ml-2 rtl:mr-2">
                  {t("delete")}
                </button>
              </td>
            </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className=" md:hidden flex h-full pb-16">
        <div className="w-full">
          <div className="">
            {users.map((user,i)=><div className="border-b hover:bg-gray-50 ">
              <h3 className="p-3">
               {t("name")}: {user.name}
              </h3>
              <h3 className="p-3">{t("email")}: {user.email}</h3>
              <h3 className="p-3">{t("role")}: {user.role}</h3>
              <h3 className="p-3">{t("phone")}: {user.phone}</h3>
              <h3 className="p-3">{t("location")}: {user.location}</h3>
              <h3 className="p-3 text-center">
                <Link to={`/dashboard/accounts/${user._id}`} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
                  {t("edit")}
                </Link>
                <button onClick={()=>deleteUser(user._id)} className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 ltr:ml-2 rtl:mr-2">
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
