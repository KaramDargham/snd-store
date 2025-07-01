import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

export default function SideBar() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
    const { t, i18n } = useTranslation();

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsMinimized(true); // Auto-minimize on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) => {
    return location.pathname === path ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white shadow-md p-4 border-r border-gray-200 
          transition-all duration-300 ease-in-out z-30
          ${isMinimized ? "w-20" : "w-64"}
          ${isMinimized && isMobile ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <div className="mb-6 flex justify-between items-center">
          {!isMinimized && (
            <Link 
              to="/" 
              className="text-2xl font-bold text-gray-700 transition-opacity duration-300"
            >
              SND Shop
            </Link>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isMinimized ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className={`mdi mdi-menu-open text-gray-500 text-xl transition-transform ${isMinimized ? "rotate-180" : ""}`}></span>
          </button>
        </div>

        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className={`flex items-center p-3 rounded-md font-medium transition-colors duration-200 ${isActive("/")} ${isMinimized ? "justify-center" : ""}`}
              >
                <span className="mdi mdi-home text-xl"></span>
                {!isMinimized && <span className="ltr:ml-3 rtl:mr-3">{t("dashboard")}</span>}
                {isMinimized && (
                  <span className="sr-only">{t("dashboard")}</span>
                )}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/products" 
                className={`flex items-center p-3 rounded-md font-medium transition-colors duration-200 ${isActive("/dashboard/products")} ${isMinimized ? "justify-center" : ""}`}
              >
                <span className="mdi mdi-shopping text-xl"></span>
                {!isMinimized && <span className="ltr:ml-3 rtl:mr-3">{t("products")}</span>}
                {isMinimized && (
                  <span className="sr-only">{t("products")}</span>
                )}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/orders" 
                className={`flex items-center p-3 rounded-md font-medium transition-colors duration-200 ${isActive("/dashboard/orders")} ${isMinimized ? "justify-center" : ""}`}
              >
                <span className="mdi mdi-cart text-xl"></span>
                {!isMinimized && <span className="ltr:ml-3 rtl:mr-3">{t("orders")}</span>}
                {isMinimized && (
                  <span className="sr-only">{t("orders")}</span>
                )}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/categories" 
                className={`flex items-center p-3 rounded-md font-medium transition-colors duration-200 ${isActive("/dashboard/categories")} ${isMinimized ? "justify-center" : ""}`}
              >
                <span className="mdi mdi-file-tree text-xl"></span>
                {!isMinimized && <span className="ltr:ml-3 rtl:mr-3">{t("categories")}</span>}
                {isMinimized && (
                  <span className="sr-only">{t("categories")}</span>
                )}
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard/accounts" 
                className={`flex items-center p-3 rounded-md font-medium transition-colors duration-200 ${isActive("/dashboard/accounts")} ${isMinimized ? "justify-center" : ""}`}
              >
                <span className="mdi mdi-account text-xl"></span>
                {!isMinimized && <span className="ltr:ml-3 rtl:mr-3">{t("accounts")}</span>}
                {isMinimized && (
                  <span className="sr-only">{t("accounts")}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40 lg:hidden">
          <div className="flex justify-around items-center">
            <Link 
              to="/" 
              className={`flex flex-col items-center p-3 text-xs ${isActive("/")}`}
            >
              <span className="mdi mdi-home text-xl mb-1"></span>
              <span>{t("dashboard")}</span>
            </Link>
            <Link 
              to="/dashboard/products" 
              className={`flex flex-col items-center p-3 text-xs ${isActive("/dashboard/products")}`}
            >
              <span className="mdi mdi-shopping text-xl mb-1"></span>
              <span>{t("products")}</span>
            </Link>
            <Link 
              to="/dashboard/orders" 
              className={`flex flex-col items-center p-3 text-xs ${isActive("/dashboard/orders")}`}
            >
              <span className="mdi mdi-cart text-xl mb-1"></span>
              <span>{t("orders")}</span>
            </Link>
            <Link 
              to="/dashboard/categories" 
              className={`flex flex-col items-center p-3 text-xs ${isActive("/dashboard/categories")}`}
            >
              <span className="mdi mdi-file-tree text-xl mb-1"></span>
              <span>{t("categories")}</span>
            </Link>
            <Link 
              to="/dashboard/accounts" 
              className={`flex flex-col items-center p-3 text-xs ${isActive("/dashboard/accounts")}`}
            >
              <span className="mdi mdi-account text-xl mb-1"></span>
              <span>{t("accounts")}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Overlay for mobile when sidebar is expanded */}
      {!isMinimized && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMinimized(true)}
        />
      )}
    </>
  );
}