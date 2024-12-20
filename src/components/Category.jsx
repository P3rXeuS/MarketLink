import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Category = ({ categories, selectedCategory, onSelectCategory }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelectCategory = (category) => {
    // console.log("Selected category:", category);
    onSelectCategory(category);
    navigate(`/?category=${category}`);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <button
        className="px-4 py-2 text-white hover:text-[#FF6500] capitalize"
        onMouseEnter={() => setIsDropdownOpen(true)}
      >
        Categories
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 bg-white shadow-lg rounded-md left-1/2 transform -translate-x-1/2">
          <div className="p-2">
            <div className="flex flex-col">
              <button
                onClick={() => handleSelectCategory("")}
                className={`text-black px-2 py-1 text-left whitespace-nowrap hover:text-[#FF6500] capitalize ${
                  selectedCategory === "" ? "font-bold" : ""
                }`}
              >
                All Products
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSelectCategory(category)}
                  className={`text-black px-2 py-1 text-left whitespace-nowrap hover:text-[#FF6500] capitalize ${
                    selectedCategory === category ? "font-bold" : ""
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
