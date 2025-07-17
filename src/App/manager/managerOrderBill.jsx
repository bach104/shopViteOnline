import { useGetAllOrdersQuery } from "../../redux/features/order/orderApi";
import { useState, useMemo } from "react";
import ManagerOrderInformation from "./base/managerOrderInformation";
import { getBaseUrl } from "../../utils/baseURL";
import OrderItem from "./base/orerItems";
import OrderSearch from "./base/searchOrder";
import Pagination from "./base/Pagination";
import MenuMobile from "./base/managerMenuMobile"
const statusOptions = [
  { value: "all", label: "Tất cả hoá đơn", color: "text-gray-600", bgColor: "bg-gray-100" },
  { value: "thanh toán khi nhận hàng", label: "Thanh toán khi nhận hàng", color: "text-green-600" },
  { value: "chuyển khoản", label: "Chuyển khoản", color: "text-blue-600" },
];

const ManagerOrderBill = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data, isLoading, isError } = useGetAllOrdersQuery({
    page,
    ...(statusFilter !== "all" && { paymentMethod: statusFilter })
  });

  const pendingOrders = useMemo(() => {
    const orders = data?.orders || [];
    if (!searchTerm) return orders;
    
    return orders.filter(order => 
      order._id.slice(-6).toUpperCase().includes(searchTerm.toUpperCase())
    );
  }, [data, searchTerm]);

  const pagination = useMemo(() => {
    return data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      ordersPerPage: 20,
      pageOrdersCount: 0
    };
  }, [data]);

  const getProductImage = (image) => {
    if (!image) return "";
    return `${getBaseUrl()}/${image.replace(/\\/g, "/")}`;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setPage(1);
    setIsDropdownOpen(false);
    setSearchTerm(""); 
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1); 
  };

  const selectedStatusLabel = statusOptions.find(opt => opt.value === statusFilter)?.label || "Tất cả đơn hàng";

  if (selectedOrder) {
    return (
      <div className="shoppingCart relative">
        <ManagerOrderInformation 
          order={selectedOrder} 
          onClose={handleCloseDetails}
        />
      </div>
    );
  }

  return (
    <>
      <div className="Manager__display--Title flex justify-items-center justify-between">
        <div className="flex items-center px-2">
            <MenuMobile/>
            <h2 className="text-xl p-4">Quản lý hoá đơn</h2>
        </div>
        <div className="flex px-4 items-center gap-3 z-50">
          <OrderSearch onSearch={handleSearch} />
          <div className="dropdown z-50 relative">
            <div 
              className="select bg-black bg-opacity-70 text-white px-4 py-2 rounded-sm cursor-pointer flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="selected">{selectedStatusLabel}</span>
              <div className={`caret ml-2 ${isDropdownOpen ? 'transform rotate-180' : ''}`}>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            {isDropdownOpen && (
              <ul className="menu z-50 absolute bg-white text-black w-full mt-1 rounded-sm shadow-lg border border-gray-200">
                {statusOptions.map((option) => (
                  <li 
                    key={option.value}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                      statusFilter === option.value ? 'bg-gray-200 font-medium' : ''
                    }`}
                    onClick={() => handleStatusChange(option.value)}
                  >
                    <span className="font-medium">{option.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      <div className="Manager__display--Box p-4">
        <div className="shoppingCart">
          <section>
            {isLoading ? (
              <div className="text-center py-8">
                <p>Đang tải đơn hàng...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <p className="text-red-500">Có lỗi khi tải đơn hàng</p>
              </div>
            ) : pendingOrders.length === 0 ? (
              <div className="text-center py-8">
                <p>
                  {searchTerm 
                    ? `Không tìm thấy đơn hàng nào với mã "${searchTerm}"`
                    : `Không có đơn hàng nào ${statusFilter === "all" ? "" : `với phương thức ${selectedStatusLabel.toLowerCase()}`}.`}
                </p>
              </div>
            ) : (
              pendingOrders.map((order) => (
                <OrderItem 
                  key={order._id}
                  order={order}
                  getProductImage={getProductImage}
                  onViewDetails={handleViewDetails}
                  mode="payment" 
                />
              ))
            )}
          </section>
        </div>
      </div>
      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        searchTerm={searchTerm}
      />
    </>
  );
};

export default ManagerOrderBill;