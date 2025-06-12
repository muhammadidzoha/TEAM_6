import React from "react";
import ProductSection from "../Pages/Dashboard/ProductSection";

const Dashboard = ({ updateCart }) => {
  return (
    <div className="max-w-7xl mx-auto font-display">
      <ProductSection updateCart={updateCart} />
    </div>
  );
};

export default Dashboard;
