//src/components/Sidebar.jsx

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass =
    "block px-4 py-2 rounded hover:bg-gray-200 transition";

  const activeClass =
    "block px-4 py-2 rounded bg-red-600 text-white transition";

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-gray-100 p-4 border-r overflow-y-auto">
      <h2 className="text-xl font-bold mb-6">Menu</h2>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeClass : linkClass)}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) => (isActive ? activeClass : linkClass)}
        >
          Products
        </NavLink>

        <NavLink
          to="/sales"
          className={({ isActive }) => (isActive ? activeClass : linkClass)}
        >
          Sales
        </NavLink>

        <NavLink
          to="/suppliers"
          className={({ isActive }) => (isActive ? activeClass : linkClass)}
        >
          Suppliers
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) => (isActive ? activeClass : linkClass)}
        >
          Reports
        </NavLink>
      </nav>
    </div>
  );
}