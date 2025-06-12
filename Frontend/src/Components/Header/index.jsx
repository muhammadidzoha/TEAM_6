import React from "react";
import Logo from "./Logo";
import Nav from "./Nav";
import Utils from "./Utils";

const index = ({ count, setCount, cartData, setCartData, removeCart }) => {
  return (
    <div className="p-2 font-display bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo />
        <Nav />
        <Utils
          count={count}
          setCount={setCount}
          cartData={cartData}
          setCartData={setCartData}
          removeCart={removeCart}
        />
      </div>
    </div>
  );
};

export default index;
