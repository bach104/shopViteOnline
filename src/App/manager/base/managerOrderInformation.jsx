import { useUpdateOrderStatusMutation } from "../../../redux/features/order/orderApi";
import { useState, useEffect } from "react";
import avatarImg from "../../../assets/img/avatar.png";
import { getBaseUrl } from "../../../utils/baseURL";

const ManagerOrderInformation = ({ order, onClose }) => {
  const [cancelledReason, setCancelledReason] = useState('');
  const [showCancelledForm, setShowCancelledForm] = useState(false);
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  
  const totalProducts = order.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (showSuccessConfirmation) {
      const timer = setTimeout(() => {
        setShowSuccessConfirmation(false);
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessConfirmation, onClose]);

  const getProductImage = (image) => {
    if (!image) return avatarImg;
    return `${getBaseUrl()}/${image.replace(/\\/g, "/")}`;
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const updateData = { 
        orderId: order._id, 
        status: newStatus,
        ...(newStatus === 'hết hàng' && { cancelledReason }) 
      };
      
      await updateStatus(updateData).unwrap();
      
      if (newStatus === 'shop đang đóng gói') {
        setShowSuccessConfirmation(true);
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert(error.data?.message || 'Có lỗi xảy ra khi cập nhật đơn hàng');
    }
  };
  return (
    <div> 
        <div className="Manager__display--Title flex justify-items-center justify-between">
            <h2 className="text-xl p-4">Chi tiết đơn hàng #{order._id.slice(-6).toUpperCase()}</h2>
            <p 
            onClick={onClose}
            className="text-white p-4 hover:text-slate-200 cursor-pointer"
            >
                quay lại
            </p>
        </div>
        <section className=" bg-white flex flex-col Manager__display--Box justify-between">
            <div className="space-y-4 p-4 ">
                {order.items.map((item, index) => (
                <div key={index} className="Manager__display--product  gap-4 h-36 justify-between p-2 ">
                    <img 
                    src={getProductImage(item.image)} 
                    className="h-32 w-32 object-cover border border-black rounded-s" 
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
                <div className="bg-gray-100 p-4 rounded-sm shadow-sm">
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

                <div className="bg-gray-100 p-4 rounded-sm shadow-sm">
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
                {showCancelledForm && (
                    <div className="bg-gray-100 p-4 rounded-sm shadow-sm">
                        <h3 className="text-lg font-semibold mb-3">Lý do hết hàng</h3>
                        <textarea
                            className="w-full p-2 border rounded"
                            rows="3"
                            value={cancelledReason}
                            onChange={(e) => setCancelledReason(e.target.value)}
                            placeholder="Nhập lý do hết hàng..."
                            required
                        />
                        <div className="flex justify-end gap-3 mt-3">
                            <button 
                            className="px-4 py-2 border rounded"
                            onClick={() => {
                                setShowCancelledForm(false);
                                setCancelledReason('');
                            }}
                            disabled={isUpdating}
                            >
                            Hủy
                            </button>
                            <button 
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                            onClick={() => handleStatusUpdate('hết hàng')}
                            disabled={isUpdating || !cancelledReason.trim()}
                            >
                            {isUpdating ? 'Đang xử lý...' : 'Xác nhận hết hàng'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-between gap-3 p-4">
                <div className="flex gap-3">
                {order.status === 'đang chờ xác nhận' && (
                    <>
                    {showSuccessConfirmation ? (
                        <button className="bg-green-600 text-white px-4 py-2 rounded" disabled>
                            ✔️ Xác nhận thành công
                        </button>
                    ) : (
                        <>
                        <button 
                            className="bg-green-600 hover:opacity-80 text-white px-4 py-2 rounded"
                            onClick={() => handleStatusUpdate('shop đang đóng gói')}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Đang xử lý...' : 'Xác nhận đơn hàng'}
                        </button>
                        <button 
                            className="bg-orange-500 hover:opacity-80 text-white px-4 py-2 rounded"
                            onClick={() => setShowCancelledForm(true)}
                            disabled={isUpdating}
                        >
                            Hết hàng
                        </button>
                        </>
                    )}
                    </>
                )}
                </div>
            </div>
        </section>
    </div>
  );
};
export default ManagerOrderInformation;