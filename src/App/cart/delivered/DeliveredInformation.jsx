import { useCancelOrderMutation } from "../../../redux/features/order/orderApi";
import { useState, useEffect } from "react";
import avatarImg from "../../../assets/img/avatar.png";
import { getBaseUrl } from "../../../utils/baseURL";

const DeliveredInformation = ({ order, onClose }) => {
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  
  const totalProducts = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const isOutOfStock = order.status === 'hết hàng';
  const isPendingConfirmation = order.status === 'đang chờ xác nhận';

  useEffect(() => {
    if (cancelSuccess) {
      const timer = setTimeout(() => {
        setCancelSuccess(false);
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [cancelSuccess, onClose]);
  const getProductImage = (image) => {
    if (!image) return avatarImg;
    return `${getBaseUrl()}/${image.replace(/\\/g, "/")}`;
  };
  const handleCancelOrder = async () => {
    if (isPendingConfirmation && !cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }
    try {
      await cancelOrder({ 
        orderId: order._id,
        reason: isOutOfStock ? 'Sản phẩm hết hàng' : cancelReason,
        status: order.status
      }).unwrap();
      setCancelSuccess(true);
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(error.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    }
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
          {/* Order Items */}
          <div className="space-y-3 shoppingContainer">
            {order.items.map((item, index) => (
              <div key={index} className="flex shoppingItems gap-2 h-32 bg__select p-2 rounded-sm shadow-sm">
                <img 
                  src={getProductImage(item.image)} 
                  className="w-28 border border-black h-full object-cover rounded-s" 
                  alt={item.name}
                  onError={(e) => (e.target.src = avatarImg)}
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
          
          {/* Payment Information */}
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
                <p><b>Trạng thái:</b> {order.status}</p>
                <p><b>Ngày đặt hàng:</b> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
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

          {/* Cancellation Section */}
          {isOutOfStock ? (
            <div className="bg__select p-4 rounded-sm shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Hủy đơn hàng hết hàng</h3>
              <div className="mb-4 p-3 bg-gray-100 rounded">
                <p className="font-medium">Lý do: <span className="text-red-500">Sản phẩm hết hàng</span></p>
                <p className="text-sm text-gray-600 mt-1">Bấm xác nhận để hủy đơn hàng</p>
              </div>
              <div className="flex justify-end">
                {cancelSuccess ? (
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    Huỷ thành công
                  </button>
                ) : (
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Đang xử lý...' : 'Xác nhận hủy'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            showCancelForm && (
              <div className="bg__select p-4 rounded-sm shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Lý do hủy đơn hàng</h3>
                <textarea
                  className="w-full p-2 border rounded mb-3"
                  rows="3"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do hủy đơn hàng..."
                  required
                />
                <div className="flex justify-end gap-3 mt-3">
                  <button 
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                    onClick={() => {
                      setShowCancelForm(false);
                      setCancelReason('');
                    }}
                    disabled={isCancelling}
                  >
                    Hủy
                  </button>
                  {cancelSuccess ? (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                      Huỷ thành công
                    </button>
                  ) : (
                    <button 
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      onClick={handleCancelOrder}
                      disabled={isCancelling || !cancelReason.trim()}
                    >
                      {isCancelling ? 'Đang xử lý...' : 'Xác nhận hủy'}
                    </button>
                  )}
                </div>
              </div>
            )
          )}

          {/* Action Buttons */}
          <div className="flex justify-between gap-3 pt-4">
            <button
              onClick={onClose}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
            >
              ← Quay lại
            </button>
            {isPendingConfirmation && !showCancelForm && !cancelSuccess && (
              <button 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => setShowCancelForm(true)}
              >
                Hủy đơn hàng
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeliveredInformation;