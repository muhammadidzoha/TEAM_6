import React from "react";
import Header from "../components/Header/Index";
import ProductSection from "../pages/home/ProductSection";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default HomeLayout;
