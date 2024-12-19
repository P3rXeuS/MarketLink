import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import Category from "./Category";
import Search from "./Search";
import UsernameDropdown from "./UsernameDropdown";

const Header = ({ onSelectCategory, onSearch }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`${import.meta.env.VITE_API}/products/categories`);
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleLogoClick = () => {
    onSelectCategory("");
    onSearch("");
    navigate("/");
  };

  return (
    <header className="bg-[#0B192C] text-white p-4 flex items-center justify-between">
      <div className="flex-grow-0">
        <h1>
          <Link
            to="/"
            className="text-xl font-bold"
            onClick={handleLogoClick}
          >
            MarketLink
          </Link>
        </h1>
      </div>

      <div className="flex-grow-0 mx-4 ml-10">
        <Category 
          categories={categories} 
          selectedCategory={""} 
          onSelectCategory={onSelectCategory} 
        />
      </div>

      <div className="flex-grow flex justify-center mr-40">
        <Search onSearch={onSearch} />
      </div>

      <div className="flex-grow-0 flex items-center space-x-4 pr-4">
        <Link to="/cart" className="flex items-center space-x-2 hover:underline">
          <IoCartOutline className="text-3xl text-white hover:text-[#FF6500]" />
        </Link>
      </div>

      <div className="flex-grow-0 flex items-center space-x-4">
        <UsernameDropdown />
      </div>
    </header>
  );
};

export default Header;
