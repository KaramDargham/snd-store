import { Link, useNavigate } from "react-router-dom";
import MobileNavBar from "../../Components/Website/MobileNavBar";
import NavBar from "../../Components/Website/NavBar";
import loginImg from "../../images/login.jpg";
import "react-phone-input-2/lib/style.css";
import { useContext, useState } from "react";
import axios from "axios";
import Cookie from "cookie-universal"
import { User } from "../../Context/UserContext"
import Loading from "../../Components/Loading/Loading";
import { useTranslation } from "react-i18next";
export default function Login() {
    const { t, i18n } = useTranslation();
  const [userData,setUserData] =useState({
  email:"",
  password:""
  })
  const context=useContext(User)

  const [error,setError]=useState(false)
  const [loading,setLoading] =useState(false)
  const cookie = Cookie()
  const nav = useNavigate()
  function fillForm(e){
const name=e.target.name
const value=e.target.value
setUserData({...userData,[name]:value})
  }
 
 async function submit(e){
 e.preventDefault()
setLoading(true)
try{
  await axios.post("https://store-3t4b.onrender.com/auth/login",userData).then((res)=>{
 cookie.set("access",res.data.accessToken)
  cookie.set("refresh",res.data.refreshToken)
  context.setUser({
    id:res.data.id,
    role:res.data.role
  })

  res.data.role==="admin" ? nav("/dashboard") : nav("/")
  })
}
catch(err){
setError(true)
}
finally{
  setLoading(false)
}
  }
  return (
    loading?<Loading />: <div className="scroll-bar bg-white">
      <div className="hidden md:block">
        <NavBar />
      </div>
      <div className="md:hidden">
        <MobileNavBar />
      </div>
      <div className="flex justify-center" dir="ltr">
        <div className="grid lg:grid-cols-12 w-[95%] h-screen lg:h-full  bg-gradient-to-tr from-sky-50 to-sky-500 lg:p-8 p-2 lg:pt-5 pt-0 mt-20 lg:mt-40 rounded-lg">
          <div className="lg:col-span-6 hidden lg:flex col-span-12 col-start-1">
            <img
              src={loginImg}
              className="lg:rounded-r-[6rem] lg:rounded-bl-none rounded-b-[2rem] w-full h-full "
              alt="Register"
            />
          </div>
          <form onSubmit={submit} dir="rtl" className="lg:col-span-5 col-span-12 lg:col-start-8 pt-16 mt-8 lg:h-full h-4/6 lg:mt-0 bg-gray-700/60 lg:rounded-l-[6rem] lg:rounded-tr-none rounded-t-xl">
            <div className="w-full flex justify-center items-center">
              <div className="w-3/4">
                <h1 className="text-4xl text-center text-white font-extrabold">
                  {t("login")}
                </h1>
              
                <div className="input-box mt-8 flex items-center border-2 gap-x-2 bg-white">
                  <span className="mdi mdi-email-box text-primaryColor text-xl border-white border-2 pl-2"></span>
                  <input
                    className="border-primaryColor border-10 rounded-md w-full h-9 outline-none"
                    type="email"
                    placeholder={t("email")}
                    required
                    name="email"
                    onChange={fillForm}
                  />
                </div>
                <div className="input-box mt-8 flex items-center border-2 gap-x-2 bg-white">
                  <span className="mdi mdi-lock text-primaryColor text-xl border-white border-2 pl-2"></span>
                  <input
                    className="border-primaryColor border-10 rounded-md w-full h-9 outline-none"
                    type="password"
                    placeholder={t("password")}
                    required
                    name="password"
                    onChange={fillForm}
                  />
                </div>
                {error &&<p className="pt-4 text-center text-red-600 font-bold">Invalid Email or Password</p>}
                  <div className="flex justify-center mt-8">
                    <button
                      type="submit"
                      className="w-1/2 bg-primaryColor rounded mt-5 p-2 font-semibold text-white"
                    >
                      {t("submit")}
                    </button>
                  </div>

                  <div className="register-link flex justify-center pt-8">
                    <p className="text-gray-300">
                      {t("dont-have-account")}
                      <Link to="/register" className="text-secondaryColor/75">
                        {t("register")}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
          
          </form>
        </div>
      </div>
    </div>
  );
}
