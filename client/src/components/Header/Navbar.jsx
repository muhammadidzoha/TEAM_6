import React from "react";
import { HSStaticMethods } from "preline/preline";
import { NavLink } from "react-router-dom";

const navList = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Products", href: "/products" },
];

const Navbar = () => {
  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);

  return (
    <div
      id="hs-pro-hcail"
      className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:block lg:w-auto lg:basis-auto lg:order-2 lg:col-span-6"
      aria-labelledby="hs-pro-hcail-collapse"
    >
      <div className="flex flex-col gap-y-4 gap-x-0 mt-5 lg:flex-row lg:justify-center lg:items-center lg:gap-y-0 lg:gap-x-7 lg:mt-0">
        {navList.map((item) => (
          <div key={item.id}>
            <NavLink
              className={({ isActive }) =>
                `relative inline-block text-black focus:outline-hidden ${
                  isActive &&
                  "before:absolute before:bottom-0.5 before:start-0 before:-z-1 before:w-full before:h-1 before:bg-yellow-400"
                }`
              }
              aria-current="page"
              to={item.href}
            >
              {item.name}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
