import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";

import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetail from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicOnlyRoute from "./routes/PublicOnlyRoute.jsx";
import Register from "./pages/Register.jsx";
import CreateOffer from "./pages/CreateOffer.jsx";
import EditOffer from "./pages/EditOffer.jsx";
import Favorites from "./pages/Favorites.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx"; 
import Profile from "./pages/Profile.jsx";
import Orders from "./pages/Orders.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { useEffect } from "react";
import './App.css'

function App() { 
  return (    
    <Routes>
      <Route element = {<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route path="/create-offer/:productId" element={<CreateOffer />} />
        <Route path="/edit-offer/:offerId" element={<EditOffer />} />
      </Route> 
    </Routes>
  );
}
export default App
