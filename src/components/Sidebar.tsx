import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard" },
  ];

  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">Smart LMS</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-2 rounded-lg ${
              location.pathname === link.path
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            {link.name}
          </Link>
        ))}
        
      </nav>
    </aside>
  );
};

export default Sidebar;
