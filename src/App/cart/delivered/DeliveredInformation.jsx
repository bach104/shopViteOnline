import { getBaseUrl } from "../../../utils/baseURL";

const DeliveredInformation = ({ order, onClose }) => {
  const totalProducts = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const getProductImage = (image) => {
    if (!image) return "https://via.placeholder.com/150";
    return `${getBaseUrl()}/${image.replace(/\\/g, "/")}`;
  };

  return (
    <div className="my-4 shoppingCart relative">
      <section className="container-width p-4">
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-2xl">Chi tiết đơn hàng #{order._id.slice(-6).toUpperCase()}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-3 shoppingContainer">
            {order.items.map((item, index) => (
              <div key={index} className="flex shoppingItems gap-2 h-32 bg__select p-2 rounded-sm shadow-sm">
                <img 
                  src={getProductImage(item.image)} 
                  className="w-28 border border-black h-full object-cover rounded-s" 
                  alt={item.name}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                />
                <div className="flex-1 shoppingItems__technology">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm">
                    <b>Giá:</b> {(item.price * item.quantity).toLocaleString()}đ
                  </p>
                  <p className="text-sm">
                    <b>Số lượng:</b> {item.quantity}
                  </p>
                  <p className="text-sm">
                    <b>Size:</b> {item.size} | <b>Màu:</b> {item.color}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg__select p-4 rounded-sm shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Thông tin thanh toán</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="flex justify-between">
                  <span>Tạm tính ({totalProducts} sản phẩm):</span>
                  <span>{order.subtotal.toLocaleString()}đ</span>
                </p>
                <p className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{order.shippingFee.toLocaleString()}đ</span>
                </p>
                <p className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span>{order.totalAmount.toLocaleString()}đ</span>
                </p>
              </div>
              <div>
                <p><b>Phương thức thanh toán:</b> {order.paymentMethod}</p>
                <p><b>Trạng thái:</b> <span className="text-blue-500">{order.status}</span></p>
                <p><b>Ngày đặt hàng:</b> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="bg__select p-4 rounded-sm shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Thông tin giao hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><b>Người nhận:</b> {order.shippingInfo.yourname}</p>
                <p><b>Số điện thoại:</b> {order.shippingInfo.phoneNumber}</p>
              </div>
              <div>
                <p><b>Địa chỉ nhận hàng:</b></p>
                <p>{order.shippingInfo.address}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-start gap-3 pt-4">
            <button
              onClick={onClose}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
            >
              ← Quay lại
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeliveredInformation;