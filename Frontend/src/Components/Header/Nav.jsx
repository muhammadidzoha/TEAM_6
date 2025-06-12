import React from "react";
import { NavLink } from "react-router-dom";

const NavItem = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Products", link: "/products" },
];

const Nav = () => {
  return (
    <div className="flex space-x-10">
      {NavItem.map((item) => (
        <NavLink
          to={item.link}
          key={item.id}
          className={({ isActive }) =>
            isActive ? "font-semibold" : "text-obito-text-secondary"
          }
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};

export default Nav;
