import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";

const UsernameDropdown = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsername = async () => {
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API}/users/${token}`);
          const user = await response.json();
        
          // console.log(user);
        
          if (user) {
            setUsername(user.username);
          } else {
            console.error("User not found");
          }
        } catch (error) {
          console.error("Failed to fetch username:", error);
        }
      }
    };

    fetchUsername();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUsername(null);
    navigate("/");
  };

  const handleLoginClick = () => {
    if (!username) {
      navigate("/login");
    }
  };

  return (
    <Menu as="div" className="relative">
      <div>
        <Menu.Button
          onClick={handleLoginClick}
          className={({ open }) =>
            open ? "text-[#FF6500]" : "text-white hover:text-[#FF6500]"
          }
        >
          {username ? `Hi, ${username}` : "Login"}
        </Menu.Button>
      </div>

      {username && (
        <Menu.Items className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none ">
          <div className="p-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`block w-full text-left px-4 py-2 text-black rounded-md ${
                    active ? "bg-gray-100" : ""
                  }`}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      )}
    </Menu>
  );
};

export default UsernameDropdown;
