import React from "react";
import Logo from "./Logo";
import ButtonGroup from "./ButtonGroup";
import Navbar from "./Navbar";

const Index = () => {
  return (
    <header className="flex flex-wrap lg:justify-start lg:flex-nowrap z-50 w-full py-7">
      <nav className="relative max-w-7xl w-full flex flex-wrap lg:grid lg:grid-cols-12 basis-full items-center px-4 md:px-6 lg:px-8 mx-auto">
        <div className="lg:col-span-3 flex items-center">
          <Logo />
          <div className="ms-1 sm:ms-2"></div>
        </div>

        <ButtonGroup />

        <Navbar />
      </nav>
    </header>
  );
};

export default Index;
