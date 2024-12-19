import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Search = ({ onSearch }) => {
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    onSearch(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
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
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default Search;
