import { Navigate, Route, Routes } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProductSection from "./pages/home/ProductSection";
import OrderSection from "./pages/home/OrderSection";
import HistorySection from "./pages/home/HistorySection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<ProductSection />} />
        <Route path="order" element={<OrderSection />} />
        <Route path="history" element={<HistorySection />} />
      </Route>
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
