import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "../../redux/features/order/orderApi";
import { useState, useMemo } from "react";
import ManagerOrderInformation from "./base/managerOrderInformation";
import { getBaseUrl } from "../../utils/baseURL";
import { toast } from "react-toastify";
import OrderItemDesktop from "./base/orerItemsDesktop";
import OrderItemMobile from "./base/orerItemsMobile";
import OrderSearch from "./base/searchOrder";
import Pagination from "./base/Pagination";
import MenuMobile from "./base/managerMenuMobile";
import { useMediaQuery } from "react-responsive";

const statusOptions = [
  { value: "đang chờ xác nhận", label: "Đơn chờ xác nhận", color: "text-yellow-600", bgColor: "bg-yellow-100" },
  { value: "shop đang đóng gói", label: "Đơn chờ đóng gói", color: "text-blue-600", bgColor: "bg-blue-100" },
  { value: "đã giao cho bên vận chuyển", label: "Đơn chờ giao", color: "text-purple-600", bgColor: "bg-purple-100" },
  { value: "đang giao", label: "Đang giao", color: "text-orange-600", bgColor: "bg-orange-100" },
  { value: "đã nhận được hàng", label: "Đã giao thành công", color: "text-green-600", bgColor: "bg-green-100" },
  { value: "đã huỷ", label: "Đơn huỷ", color: "text-red-600", bgColor: "bg-red-100" },
];

const ManagerOrder = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("đang chờ xác nhận");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const { data, isLoading, isError, refetch } = useGetAllOrdersQuery({
    page,
    status: statusFilter
  });

  const [updateStatus] = useUpdateOrderStatusMutation();

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

  const handleConfirmOrder = async (orderId) => {
    try {
      setProcessingOrderId(orderId);
      await updateStatus({ 
        orderId, 
        status: "đã giao cho bên vận chuyển" 
      }).unwrap();
      
      toast.success("Xác nhận đơn hàng thành công");
      refetch(); 
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(error.data?.message || 'Có lỗi xảy ra khi xác nhận đơn hàng');
    } finally {
      setProcessingOrderId(null);
    }
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

  const selectedStatusLabel = statusOptions.find(opt => opt.value === statusFilter)?.label || "Đơn chờ xác nhận";
  
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
      <div className="Manager__display--Title flex justify-items-center flex-wrap justify-between">
        <div className="flex items-center px-2">
            <MenuMobile/>
            <h2 className="text-xl p-4">Quản lý đơn hàng</h2>
        </div>
        <div className="flex px-4 ManagerSearch flex-wrap items-center z-50 gap-4">
          <OrderSearch onSearch={handleSearch} />
          <div className="dropdown ManagerSearch__Lish z-50 relative">
            <div 
              className="select  bg-black bg-opacity-70 text-white px-4 py-2 rounded-sm cursor-pointer flex items-center justify-between"
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
                    : `Không có đơn hàng nào ${selectedStatusLabel.toLowerCase()}.`}
                </p>
              </div>
            ) : (
              pendingOrders.map((order) => (
                isMobile ? (
                  <OrderItemMobile
                    key={order._id}
                    order={order}
                    getProductImage={getProductImage}
                    onViewDetails={handleViewDetails}
                    onConfirmOrder={handleConfirmOrder}
                    isUpdating={processingOrderId === order._id}
                    mode="status" 
                  />
                ) : (
                  <OrderItemDesktop
                    key={order._id}
                    order={order}
                    getProductImage={getProductImage}
                    onViewDetails={handleViewDetails}
                    onConfirmOrder={handleConfirmOrder}
                    isUpdating={processingOrderId === order._id}
                    mode="status" 
                  />
                )
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

export default ManagerOrder;