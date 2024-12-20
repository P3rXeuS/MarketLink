import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Search = ({ onSearch }) => {
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const searchValue = event.target.value;
    // console.log("Input changed:", searchValue);
    onSearch(searchValue);
  };

  const handleKeyPress = (event) => {
    // console.log("Key pressed:", event.key);
    if (event.key === "Enter") {
      // console.log("Navigating to home");
      navigate("/");
    }
  };

  return (
    <div className="relative">
      <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        placeholder="Search for products..."
        className="pl-10 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default Search;
