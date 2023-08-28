import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../src/components/Login.jsx"; 
import LoginAdmin from "../src/components/LoginAdmin.jsx"; 
import Register from "../src/components/Register.jsx"; 
import RegisterAdmin from "../src/components/RegisterAdmin.jsx"; 
import Home from "../src/components/Home.jsx"; 
import DepartmentFeed from "../src/components/DepartmentFeed.jsx"; 
import BrandFeed from "../src/components/BrandFeed.jsx";
import CategoryFeed from "../src/components/CategoryFeed.jsx";
import MyOrder from "../src/components/MyOrder.jsx";
import Checkout from "../src/components/Checkout.jsx";
import OrderConfirmed from "../src/components/OrderConfirmed.jsx";
import AdminPanel from "../src/components/AdminPanel.jsx";

const App = () => (

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="./home" />}/>
      <Route path="/login" exact element={<Login />} />
      <Route path="/loginAdmin" exact element={<LoginAdmin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/registerAdmin" element={<RegisterAdmin />} />
      <Route path="/home" element={<Home />} />
      <Route path="/myOrder" element={<MyOrder />} />
      <Route path="/department/:dname" element={<DepartmentFeed />} /> 
      <Route path="/department/:dname/:cname" element={<CategoryFeed />} /> 
      <Route path="/brand/:brandName" element={<BrandFeed />} /> 
      <Route path="/myOrder/checkout" element={<Checkout />} />
      <Route path="/myOrder/checkout/orderConfirmed" element={<OrderConfirmed />} />
      <Route path="/adminPanel" element={<AdminPanel />} />
    </Routes>
  </BrowserRouter>
);

export default App;
