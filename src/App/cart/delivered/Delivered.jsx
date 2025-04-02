import { useState } from "react";
import DeliveredInformation from "./deliveredInformation";
import { useGetUserOrdersQuery } from "../../../redux/features/order/orderApi";
import { getBaseUrl } from "../../../utils/baseURL";
import { useSelector } from "react-redux";

const Delivery = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;
  const { data: orders = [], isLoading, error } = useGetUserOrdersQuery(undefined, {
    skip: !isLoggedIn
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const getProductImage = (image) => {
    if (!image) return "";
    return `${getBaseUrl()}/${image.replace(/\\/g, "/")}`;
  };
  const filteredOrders = orders.filter(order => 
    order.status === 'Shop đang đóng gói' || 
    order.status === 'đã giao cho bên vận chuyển'
  );

  if (showDetails) {
    return (
      <div className="my-4 shoppingCart relative">
        <section className="container-width p-4">
          <DeliveredInformation 
            order={selectedOrder} 
            onClose={handleCloseDetails}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="my-4 shoppingCart relative">
      <section className="container-width p-4">
        <div className="flex justify-between pb-2">
          <h2 className="text-2xl">Đơn hàng đã giao</h2>
          {isLoggedIn && filteredOrders.length > 0 && (
            <p className="text-gray-500">
              Hiển thị {filteredOrders.length} đơn hàng đang xử lý
            </p>
          )}
        </div>
        <div className="space-y-3 shoppingContainer">
          {!isLoggedIn ? (
            <div className="text-center py-8">
              <p className="text-lg font-semibold text-gray-500">
                Vui lòng đăng nhập để xem đơn hàng của bạn
              </p>
            </div>
          ) : isLoading ? (
            <p>Đang tải đơn hàng...</p>
          ) : error ? (
            <p>Có lỗi khi tải đơn hàng: {error.message}</p>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p>Bạn không có đơn hàng nào đang chờ xử lý.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderItem 
                key={order._id}
                order={order}
                getProductImage={getProductImage}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const OrderItem = ({ order, getProductImage, onViewDetails }) => {
  const firstProductImage = order.items[0]?.image || '';
  const totalProducts = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex shoppingItems gap-2 h-32 bg__select p-2 rounded-sm mb-3 shadow-sm">
      <div className="w-28 flex items-center justify-center">
        <img 
          src={getProductImage(firstProductImage)}
          className="w-28 border border-black h-full object-cover rounded-s"
          alt={order.items[0]?.name}
          onError={(e) => {
            e.target.src = "";
            e.target.className += " bg-gray-200";
          }}
        />
      </div>
      <div className="flex-1 shoppingItems__technology">
        <h3><b>Đơn hàng:</b> #{order._id.slice(-6).toUpperCase()}</h3>
        <p className="text-sm">
          <b>Tổng cần thanh toán:</b> {order.totalAmount.toLocaleString()}đ
        </p>
        <p className="text-sm">
          <b>Số lượng sản phẩm:</b> {totalProducts}
        </p>
        <p className="text-sm">
          <b>Ngày đặt:</b> {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <b>Trạng thái đơn hàng:</b> 
          <span className={`ml-1 ${
            order.status === 'Shop đang đóng gói' ? 'text-blue-500' : 
            order.status === 'đã giao cho bên vận chuyển' ? 'text-purple-600' : ''
          }`}>
            {order.status}
          </span>
        </p>
      </div>
      <div className="flex h-full shoppingItems__click items-end">
        <button
          className="bg-black hover:opacity-70 opacity-80 transition text-white rounded-lg px-4 py-1"
          onClick={() => onViewDetails(order)}
        >
          Xem thông tin
        </button>
      </div>
    </div>
  );
};

export default Delivery;