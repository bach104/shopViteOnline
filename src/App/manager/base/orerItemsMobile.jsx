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

const OrderItemMobile = ({ 
  order, 
  getProductImage, 
  onViewDetails, 
  onConfirmOrder, 
  isUpdating,
  mode = "status" 
}) => {
  const firstProduct = order.items[0];
  const firstProductImage = firstProduct?.image ? getProductImage(firstProduct.image) : '';
  const statusOption = orderStatusOptions.find(opt => opt.value === order.status) || {};
  const paymentOption = paymentMethodOptions.find(opt => opt.value === order.paymentMethod) || {};
  return (
    <>
      <div className="Manager__display--product Manager__display--Mobile flex h-36 gap-4 justify-between p-2 mb-4 rounded-md shadow-sm hover:shadow-md transition-shadow ">
          {firstProductImage ? (
            <img 
              src={firstProductImage}
              className="h-full w-28 object-cover border border-black rounded-s"
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
        <div className="w-full h-full flex flex-col">
            <div>
                <h3 className="font-semibold">
                    <span className="text-gray-600">Mã đơn hàng:</span> #{order._id.slice(-6).toUpperCase()}
                </h3>
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
            <div className="flex justify-end h-full items-end">
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
      </div>
    </>
  );
};

export default OrderItemMobile;