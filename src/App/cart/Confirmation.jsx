import { useState } from "react";
import ConfirmationInformation from "./base/informationOrder";
import { useGetUserOrdersQuery } from "../../redux/features/order/orderApi";
import { getBaseUrl } from "../../utils/baseURL";
import { useSelector } from "react-redux";
import OrderItem from "./base/OrderItem"; 

const Confirmation = () => {
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
    order?.status === 'đang chờ xác nhận' || 
    order?.status === 'hết hàng'
  );

  const statusColors = {
    'đang chờ xác nhận': 'text-yellow-500',
    'hết hàng': 'text-red-400'
  };

  if (showDetails && selectedOrder) {
    return (
      <div className="my-4 shoppingCart relative">
        <section className="container-width p-4">
          <ConfirmationInformation 
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
        <div className="flex shoppingCartHeader justify-between pb-2">
          <h2 className="text-2xl shoppingCartHeader__title">Chờ xác nhận</h2>
          {isLoggedIn && filteredOrders.length > 0 && (
            <p className="text-gray-500 shoppingCartHeader__count ">
              Hiển thị {filteredOrders.length} đơn hàng đang chờ xử lý
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
            <div className="text-center py-4 text-lg font-semibold text-gray-500">
              Bạn không có đơn hàng nào đang chờ xử lý.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderItem 
                key={order._id}
                order={order}
                getProductImage={getProductImage}
                onViewDetails={handleViewDetails}
                statusColors={statusColors}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Confirmation;