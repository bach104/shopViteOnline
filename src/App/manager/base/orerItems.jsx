const paymentMethodOptions = [
  { value: "thanh toán khi nhận hàng", label: "Thanh toán khi nhận hàng", color: "text-green-600" },
  { value: "chuyển khoản", label: "Chuyển khoản", color: "text-blue-600" },
];

const orderStatusOptions = [
  { value: "đang chờ xác nhận", label: "Đơn chờ xác nhận", color: "text-yellow-600", bgColor: "bg-yellow-100" },
  { value: "shop đang đóng gói", label: "Đơn chờ đóng gói", color: "text-blue-600", bgColor: "bg-blue-100" },
  { value: "đã giao cho bên vận chuyển", label: "Đơn chờ giao", color: "text-purple-600", bgColor: "bg-purple-100" },
  { value: "đang giao", label: "Đang giao", color: "text-orange-600", bgColor: "bg-orange-100" },
  { value: "đã nhận được hàng", label: "Đã giao thành công", color: "text-green-600", bgColor: "bg-green-100" },
  { value: "đã huỷ", label: "Đơn huỷ", color: "text-red-600", bgColor: "bg-red-100" },
];

const OrderItem = ({ 
  order, 
  getProductImage, 
  onViewDetails, 
  onConfirmOrder, 
  isUpdating,
  mode = "status" 
}) => {
  const firstProduct = order.items[0];
  const firstProductImage = firstProduct?.image ? getProductImage(firstProduct.image) : '';
  const totalProducts = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
  
  const statusOption = orderStatusOptions.find(opt => opt.value === order.status) || {};
  const paymentOption = paymentMethodOptions.find(opt => opt.value === order.paymentMethod) || {};

  return (
    <div className="Manager__display--product flex h-36 gap-4 justify-between p-2 mb-4 rounded-md shadow-sm hover:shadow-md transition-shadow ">
      <div className="flex items-center">
        {firstProductImage ? (
          <img 
            src={firstProductImage}
            className="h-32 w-32 object-cover border border-black rounded-s"
            alt={firstProduct?.name || 'Ảnh sản phẩm'}
            onError={(e) => {
              e.target.src = "";
              e.target.className += " bg-gray-200";
            }}
          />
        ) : (
          <div className="h-32 w-32 border border-gray-200 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs text-center">Không có ảnh</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="font-semibold">
          <span className="text-gray-600">Đơn hàng:</span> #{order._id.slice(-6).toUpperCase()}
        </h3>
        <p className="text-sm">
          <span className="text-gray-600">Khách hàng:</span> {order.shippingInfo?.yourname || 'N/A'}
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Ngày đặt:</span> {orderDate}
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Tổng tiền:</span> {order.totalAmount?.toLocaleString('vi-VN') || 0}đ
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Số lượng:</span> {totalProducts} sản phẩm
        </p>
        
        {mode === "status" ? (
          <p className="text-sm">
            <span className="text-gray-600">Trạng thái:</span>
            <span className={`ml-1 font-medium ${statusOption.color || 'text-gray-600'}`}>
              {statusOption.label || order.status}
            </span>
          </p>
        ) : (
          <p className="text-sm">
            <span className="text-gray-600">Phương thức thanh toán:</span>
            <span className={`ml-1 font-medium ${paymentOption.color || 'text-gray-600'}`}>
              {paymentOption.label || order.paymentMethod}
            </span>
          </p>
        )}
      </div>
      <div className="flex items-end h-full">
        {mode === "status" && order.status === "shop đang đóng gói" ? (
          <button
            className={`flex bg-black bg-opacity-70 hover:bg-opacity-90 transition items-center text-white px-4 py-2 rounded-sm ${
              isUpdating ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            onClick={() => onConfirmOrder(order._id)}
            disabled={isUpdating}
          >
            {isUpdating ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        ) : (
          <button
            className="flex bg-black bg-opacity-70 hover:bg-opacity-90 transition items-center text-white px-4 py-2 rounded-sm"
            onClick={() => onViewDetails(order)}
          >
            Xem chi tiết
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderItem;