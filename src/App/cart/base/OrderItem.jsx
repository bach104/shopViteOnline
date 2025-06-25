const OrderItem = ({ order, getProductImage, onViewDetails, statusColors = {} }) => {
  const firstProductImage = order.items[0]?.image || '';
  const totalProducts = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const defaultStatusColors = {
    'đang giao': 'text-green-500',
    'shop đang đóng gói': 'text-blue-500',
    'đã giao cho bên vận chuyển': 'text-purple-600',
    'đã nhận được hàng': 'text-green-700',
    'đang chờ xác nhận': 'text-yellow-500',
    'hết hàng': 'text-red-400',
    ...statusColors
  };

  return (
    <div className="flex shoppingItems gap-2 h-32 bg__select p-2 rounded-sm mb-3 shadow-sm">
      <div className="w-28 flex items-center justify-center">
        <img 
          src={getProductImage(firstProductImage)}
          className="w-28 border border-black h-full object-cover rounded-s"
          alt={order.items[0]?.name || 'Product image'}
          onError={(e) => {
            e.target.src = "";
            e.target.className += " bg-gray-200";
          }}
        />
      </div>
      <div className="flex-1 shoppingItems__technology">
        <h3><b>Đơn hàng:</b> #{order._id?.slice(-6).toUpperCase() || 'N/A'}</h3>
        <p className="text-sm">
          <b>Tổng cần thanh toán:</b> {(order.totalAmount || 0).toLocaleString()}đ
        </p>
        <p className="text-sm">
          <b>Ngày đặt:</b> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
        </p>
        <p className="text-sm">
          <b>Số lượng sản phẩm:</b> {totalProducts}
        </p>
        <p>
          <b>Trạng thái đơn hàng:</b> 
          <span className={`ml-1 ${defaultStatusColors[order.status] || ''}`}>
            {order.status || 'N/A'}
          </span>
        </p>
      </div>
      <div className="flex h-full shoppingItems__click items-end">
        <button
          className="btn__click2"
          onClick={() => onViewDetails(order)}
        >
          Xem thông tin
        </button>
      </div>
    </div>
  );
};

export default OrderItem;