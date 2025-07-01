import { Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import HomePage from "./Pages/Website/HomePage";
import "./App.css";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Accounts from "./Pages/Dashboard/Accounts/Accounts";
import RequireAuth from "./Pages/Auth/RequireAuth";
import EditUser from "./Pages/Dashboard/Accounts/EditUser";
import AddCategory from "./Pages/Dashboard/Categories/AddCategory";
import EditCategory from "./Pages/Dashboard/Categories/EditCategory";
import ShowCategories from "./Pages/Dashboard/Categories/ShowCategories";
import Categories from "./Pages/Website/Categories";
import Category from "./Components/Website/Category";
import ShowProducts from "./Pages/Dashboard/Products/ShowProducts";
import EditProduct from "./Pages/Dashboard/Products/EditProduct";
import ProductPage from "./Pages/Website/ProductPage";
import AddProduct from "./Pages/Dashboard/Products/AddProduct";
import Cart from "./Pages/Website/Cart";
import ShowOrders from "./Pages/Dashboard/Orders/ShowOrders";
import EditStatus from "./Pages/Dashboard/Orders/EditStatus";
import Cookie from "cookie-universal";
import Shop from "./Pages/Website/Shop";
function App() {
  const cookie = Cookie();
  const lang = cookie.get("lang") || "ar";

  const [direction, setDirection] = useState(lang === "ar" ? "rtl" : "ltr");

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);
  return (
    <div className={lang==="rtl" ? "font-['Cairo']" : ""}>
    <Routes>
      // Global Routes
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:id" element={<Category />} />
      <Route path="/products/:id" element={<ProductPage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />
      // Protected Routes
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="products" element={<ShowProducts />} />
          <Route path="products/:id" element={<EditProduct />} />
          <Route path="addProduct" element={<AddProduct />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="accounts/:id" element={<EditUser />} />
          <Route path="categories" element={<ShowCategories />} />
          <Route path="addCategory" element={<AddCategory />} />
          <Route path="categories/:id" element={<EditCategory />} />
          <Route path="orders" element={<ShowOrders />} />
          <Route path="orders/:id" element={<EditStatus />} />
        </Route>
      </Route>
    </Routes>
    </div>
  );
}

export default App;
