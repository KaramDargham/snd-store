import { useContext, useEffect, useState } from "react";
import Logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import Cookie from "cookie-universal";
import { User } from "../../Context/UserContext";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function MobileNavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const cookie = Cookie();
  const accessToken = cookie.get("access");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const context = useContext(User);
  const { t, i18n } = useTranslation();
  async function getMyInfo() {
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/info", {
        headers: {
          Authorization: accessToken,
        },
      });
      context.setUser({
        role: res.data.role,
        id: res.data._id,
      });
      setIsLoggedIn(true);
    } catch (err) {
      console.log(err);
    }
  }

  function logout() {
    context.setUser({});
    cookie.remove("access");
    cookie.remove("refresh");
    setIsLoggedIn(false);
    setAccountDropdownOpen(false);
  }
  

  useEffect(() => {
    getMyInfo();
  }, []);

  return (
    <div className="md:hidden fixed top-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 md:py-4 py-2 flex items-center justify-between">
        <Link to="/">
          <img src={Logo} alt="Ecom" className="h-14 w-14" />
        </Link>

        {isLoggedIn ? (
          <div className="flex gap-x-6 items-center">
            <div className="relative">
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="focus:outline-none"
              >
                <span className="mdi mdi-account-outline text-2xl text-secondaryColor"></span>
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    to="/notifications"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setAccountDropdownOpen(false)}
                  >
                    <span className="mdi mdi-bell-outline mr-3"></span>
                    Notifications
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setAccountDropdownOpen(false)}
                  >
                    <span className="mdi mdi-package-variant-closed mr-3"></span>
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span className="mdi mdi-logout mr-3"></span>
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Link to="/cart" className="mdi mdi-cart-outline text-2xl text-secondaryColor"></Link>
            
            <button
              className="text-gray-700 focus:outline-none text-2xl"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              ☰
            </button>
          </div>
        ) : (
          <div className="flex gap-x-4 items-center">
            <Link to="/login" className="py-2 px-4 text-secondaryColor font-semibold">
              {t("login")}
            </Link>
            <button
              className="text-gray-700 focus:outline-none text-2xl"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              ☰
            </button>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="px-4 py-2 bg-gray-100">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="block py-2 px-4 text-gray-700 hover:text-blue-500"
                onClick={() => setMenuOpen(false)}
              >
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="block py-2 px-4 text-gray-700 hover:text-blue-500"
                onClick={() => setMenuOpen(false)}
              >
                {t("about")}
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className="block py-2 px-4 text-gray-700 hover:text-blue-500"
                onClick={() => setMenuOpen(false)}
              >
                {t("shop")}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="block py-2 px-4 text-gray-700 hover:text-blue-500"
                onClick={() => setMenuOpen(false)}
              >
               {t("contact")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}