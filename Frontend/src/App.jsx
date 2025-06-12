import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./Layout/Dashboard";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { useEffect, useState } from "react";
import OrderSection from "./Pages/Orders/OrderSection";
import History from "./Pages/History/History";

function App() {
  const [count, setCount] = useState(0);
  const [cartData, setCartData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem("cart")) {
      const initialData = {
        count: 0,
        product: [],
      };
      localStorage.setItem("cart", JSON.stringify(initialData));
    }
  }, []);

  const updateCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || {
      count: 0,
      product: [],
    };
    setCount(cartData.count);
    setCartData(cartData.product);
  };

  const removeFromCart = (productId) => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || {
      count: 0,
      product: [],
    };

    const productIndex = cartData.product.findIndex(
      (item) => item.id === productId
    );

    if (productIndex !== -1) {
      cartData.product[productIndex].total -= 1;

      if (cartData.product[productIndex].total === 0) {
        cartData.product.splice(productIndex, 1);
      }
    }

    cartData.count = cartData.product.reduce(
      (acc, item) => acc + item.total,
      0
    );

    localStorage.setItem("cart", JSON.stringify(cartData));

    setCartData(cartData.product);
    setCount(cartData.count);
  };

  const isHiddenPage =
    location.pathname.startsWith("/orders/") ||
    location.pathname === "/history-transcation";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-obito-grey">
      <div>
        {!isHiddenPage && (
          <Header
            count={count}
            setCount={setCount}
            cartData={cartData}
            setCartData={setCartData}
            removeCart={removeFromCart}
          />
        )}
        <Routes>
          <Route path="/" element={<Dashboard updateCart={updateCart} />} />
          <Route path="/orders/:id" element={<OrderSection />} />
          <Route path="/history-transcation" element={<History />} />
        </Routes>
      </div>
      {!isHiddenPage && <Footer />}
    </div>
  );
}

export default App;
