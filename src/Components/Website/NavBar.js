import { Link } from "react-router-dom";
import Logo from "../../images/logo.png";
import Cookie from "cookie-universal";
import { useContext, useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { User } from "../../Context/UserContext";
import { useTranslation } from "react-i18next";

export default function NavBar() {
  const cookie = Cookie();
  const accessToken = cookie.get("access");
  const [showCategories, setShowCategories] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { t, i18n } = useTranslation();
  const [myLang, setMyLang] = useState(cookie.get("lang") || "ar");
  const searchRef = useRef(null);

  // Animated placeholder state
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  // Translated words for animation
  const words = [
    t("search-for-items"),
    t("search-what-you-want"),
    t("search-anything"),
  ];

  const changeLanguage = () => {
    const newLang = myLang === "ar" ? "en" : "ar";
    cookie.set("lang", newLang);
    i18n.changeLanguage(newLang).then(() => {
      setMyLang(newLang);
    });
    window.location.reload();
  };

  async function getCategories() {
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function getProducts() {
    try {
      let res = await axios.get("https://store-3t4b.onrender.com/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  // Search function
  const searchProducts = useCallback(
    (term) => {
      if (term.length < 3) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      const results = products.filter(
        (product) =>
          product.name.toLowerCase().includes(term.toLowerCase()) ||
          (product.description &&
            product.description.toLowerCase().includes(term.toLowerCase()))
      );
      setSearchResults(results);
      setShowResults(true);
    },
    [products]
  );

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Memoize the debounced search function
  const debouncedSearch = useCallback(debounce(searchProducts, 300), [
    searchProducts,
  ]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSearchFocus = () => {
    if (searchTerm.length >= 3) {
      setShowResults(true);
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchTerm("");
  };

  const context = useContext(User);

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
    setShowAccountDropdown(false);
  }

  // Typing animation effect
  useEffect(() => {
    const typeWriter = () => {
      const currentWord = words[currentWordIndex];

      if (isTyping) {
        // Typing forward
        if (charIndex < currentWord.length) {
          setAnimatedPlaceholder(currentWord.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Pause at full word
          setTimeout(() => setIsTyping(false), 1500);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setAnimatedPlaceholder(currentWord.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Move to next word
          setIsTyping(true);
          setCurrentWordIndex((currentWordIndex + 1) % words.length);
        }
      }
    };

    const timer = setTimeout(typeWriter, isTyping ? 100 : 50);
    return () => clearTimeout(timer);
  }, [charIndex, currentWordIndex, isTyping, words]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    getCategories();
    getProducts();
    getMyInfo();
  }, []);

  return (
    <header
      className="fixed w-full top-0 bg-white shadow-md z-50 "
      dir={myLang === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-1 w-full">
          {/* Search Bar */}
          <div className="flex items-center overflow-hidden justify-center gap-x-8 w-2/3">
  <div className="ltr:pr-3 rtl:pl-3">
    <Link to="/">
      <img src={Logo} alt="Ecom" className="h-[60px] w-[60px]" />
    </Link>
  </div>
  <div className="relative" ref={searchRef}>
    <input
      type="text"
      placeholder={animatedPlaceholder}
      className="p-2 focus:outline-none w-[450px] border rounded-md"
      value={searchTerm}
      onChange={handleSearchChange}
      onFocus={handleSearchFocus}
    />
    {showResults && (
      <div className=" top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-[1000] max-h-60 overflow-y-auto">
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={handleResultClick}
            >
              {product.name}
            </Link>
          ))
        ) : searchTerm.length >= 3 ? (
          <div className="px-4 py-2 text-gray-500">
            {t("no-results-found")}
          </div>
        ) : null}
      </div>
    )}
  </div>
  <div className="hidden xl:flex space-x-6"></div>
</div>

          {/* Navigation */}

          {/* Account & Cart */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-4 w-1/3 justify-center relative">
              <div className="relative">
                <button
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="focus:outline-none"
                >
                  <span className="mdi mdi-account-outline text-2xl rtl:pl-4 text-secondaryColor hover:text-primaryColor cursor-pointer"></span>
                </button>

                {showAccountDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/notifications"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      <span className="mdi mdi-bell-outline ltr:mr-2 rtl:ml-2"></span>
                      {t("notifications")}
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      <span className="mdi mdi-package-variant-closed ltr:mr-2 rtl:ml-2"></span>
                      {t("my-orders")}
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full ltr:text-left rtl:text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <span className="mdi mdi-logout ltr:mr-2 rtl:ml-2"></span>
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>

              <Link
                to="/cart"
                className="mdi mdi-cart-outline text-2xl text-secondaryColor hover:text-primaryColor"
              ></Link>
              <button
                onClick={changeLanguage}
                className="mdi mdi-web text-2xl text-secondaryColor hover:text-primaryColor"
              ></button>
            </div>
          ) : (
            <div className="flex items-center space-x-1 w-1/3 justify-center text-secondaryColor font-semibold">
              <Link to="/login">{t("login")}</Link>{" "}
              <span className="mdi mdi-login text-xl ltr:pt-[4px] rtl:pb-[2px] flex text-primaryColor rtl:pl-1 rtl:rotate-180"></span>
            </div>
          )}
        </div>
      </div>
      <hr className="w-full" />
      {/* Header Bottom */}
      <div className="py-4">
        <div className="container mx-auto flex items-center justify-center px-4 relative">
          <button
            onClick={() => setShowCategories((prev) => !prev)}
            className="bg-primaryColor flex justify-between items-center text-white px-4 py-2 rounded w-1/6"
          >
            <div></div>
            <p>{t("shop-by-categories")}</p>
            <span className="mdi mdi-arrow-down-drop-circle"></span>
          </button>
          {showCategories && (
            <div className="absolute top-[100%] ltr:left-[17.3%] rtl:right-[17.3%] rounded ltr:-translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/6 z-50 bg-slate-100 w-1/6 p-2">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/categories/${category._id}`}
                  reloadDocument
                  className="block py-2 px-4 text-center text-gray-700"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
          <nav className="hidden md:flex space-x-6 w-2/3 ltr:pl-8 rtl:pr-8">
            <Link to="/" className="text-gray-700 hover:text-blue-500 rtl:pl-6">
              {t("home")}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-500">
              {t("about")}
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-blue-500">
              {t("shop")}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-500">
              {t("contact")}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
