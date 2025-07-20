import { useState } from "react";

const OrderSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  return (
    <div className="flex ManagerSearch__Search items-center gap-2">
      <input
        type="text"
        placeholder="Tìm kiếm mã đơn hàng"
        value={searchTerm}
        onChange={handleChange}
        className="p-1.5 outline-none text-gray-400 pl-3 rounded-md border border-gray-300 focus:border-black transition-colors w-64"
      />
    </div>
  );
};

export default OrderSearch;