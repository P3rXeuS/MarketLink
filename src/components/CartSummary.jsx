import React from "react";

const CartSummary = ({ total, handleBuy, selectedItems }) => {
  // console.log("Total:", total);
  // console.log("Selected Items:", selectedItems);

  return (
    <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow h-[250px]">
      <h2 className="text-lg font-bold mb-4">Summary</h2>
      <div className="mb-4">
        <p className="text-gray-600 text-sm">Total</p>
        <p className="text-xl font-bold">
          ${total.toLocaleString("id-ID")}
        </p>
      </div>
      <button
        onClick={handleBuy}
        disabled={selectedItems.size === 0}
        className={`w-full py-3 rounded-lg mt-10 ${
          selectedItems.size > 0
            ? "bg-[#FF6500] text-white hover:bg-[#E55C00]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Buy
      </button>
    </div>
  );
};

export default CartSummary;
