import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCreateOrderMutation } from '../../../redux/features/order/orderApi';
import Loader from './Loader';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const CartSummary = ({ 
  totalQuantity, 
  totalPrice, 
  onClearSelection, 
  selectedItems,
  onOrderSuccess 
}) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    let timer;
    if (orderSuccess) {
      timer = setTimeout(() => {
        setOrderSuccess(false);
        setPaymentMethod(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [orderSuccess]);

  const price = Number(totalPrice) || 0;
  const shippingFee = price * 0.15;
  const finalAmount = Math.round(price + shippingFee);

  const handlePayment = async () => {
    if (orderSuccess) return;

    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }

    if (finalAmount < 1000) {
      toast.error('Số tiền thanh toán tối thiểu là 1,000 VND');
      return;
    }

    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    const shippingInfo = {
      yourname: user.yourname,
      phoneNumber: user.phoneNumber,
      address: user.address
    };

    const orderInfo = `Thanh toán đơn hàng từ ${user.yourname}`;

    try {
      const orderData = {
        cartIds: selectedItems,
        paymentMethod: paymentMethod === 'momo' ? 'chuyển khoản' : 'thanh toán khi nhận hàng',
        amount: finalAmount,
        orderInfo,
        shippingInfo,
        subtotal: price,
        shippingFee,
        totalAmount: finalAmount
      };
      const result = await createOrder(orderData).unwrap();
      if (paymentMethod === 'momo') {
        if (result.payUrl) {
          localStorage.setItem('currentPayment', JSON.stringify({
            amount: finalAmount,
            items: totalQuantity,
            orderId: result.orderId,
            timestamp: new Date().toISOString()
          }));
          window.location.href = result.payUrl;
        } else {
          toast.error('Không nhận được đường dẫn thanh toán từ MoMo');
        }
      } else {
        setOrderSuccess(true);
        onOrderSuccess();
        toast.success('Đặt hàng thành công!', { duration: 3000 });
        onClearSelection();
      }
    } catch (error) {
      console.error('Order error:', error?.data || error);
      if (error?.data?.message?.includes('Vui lòng cập nhật đầy đủ thông tin')) {
        setErrorMessage(error.data.message);
        setShowProfileUpdateModal(true);
      } else {
        toast.error(error?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
      }
    }
  };

  const handleUpdateProfile = () => {
    setShowProfileUpdateModal(false);
    navigate('/informations');
  };

  const paymentMethods = [
    { id: 'momo', label: 'Thanh toán MoMo', icon: 'fa-qrcode' },
    { id: 'cod', label: 'Thanh toán khi nhận hàng', icon: 'fa-money-check-dollar' }
  ];

  const getButtonText = () => {
    if (orderSuccess) return 'ĐẶT HÀNG THÀNH CÔNG';
    if (!paymentMethod) return 'THANH TOÁN';
    if (paymentMethod === 'cod') return 'ĐẶT HÀNG';
    return `THANH TOÁN ${finalAmount.toLocaleString('vi-VN')} ₫`;
  };

  return (
    <>
      <div className="mx-auto cart__Pay p-4 mt-6 bg-black bg-opacity-90 text-white rounded-lg shadow-lg">
        <div className="border-b border-gray-700 pb-4 mb-4">
          <h3 className="text-xl font-bold mb-3">TÓM TẮT ĐƠN HÀNG</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tổng sản phẩm:</span>
              <span className="font-medium">{totalQuantity || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span className="font-medium">{price.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span className="font-medium">{shippingFee.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between text-lg mt-2 pt-2 border-t border-gray-700">
              <span className="font-semibold">Tổng cộng:</span>
              <span className="font-bold text-yellow-400">{finalAmount.toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>
        </div>
        <div className="mb-5">
          <h3 className="text-lg font-semibold mb-3">PHƯƠNG THỨC THANH TOÁN</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-3 border rounded-lg transition-all ${
                  paymentMethod === method.id ? 'border-yellow-400 bg-gray-800' : 'border-gray-700 hover:border-gray-600'
                } ${orderSuccess ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !orderSuccess && setPaymentMethod(method.id)}
              >
                <div className="flex items-center">
                  <i className={`fa-solid mr-4 ${method.icon}`}></i>
                  <span>{method.label}</span>
                  {paymentMethod === method.id && (
                    <i className={`fa-solid ml-auto text-green-400 material-icons-round mr-4 ${method.icon}`}></i>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onClearSelection}
            disabled={orderSuccess || selectedItems.length === 0}
            className={`py-2 px-4 bg-gray-700 rounded-lg transition ${
              orderSuccess || selectedItems.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-600'
            }`}
          >
            Xóa lựa chọn
          </button>
          <button
            onClick={handlePayment}
            disabled={!paymentMethod || isOrderLoading || finalAmount === 0 || orderSuccess || selectedItems.length === 0}
            className={`py-3 font-bold rounded-lg transition flex items-center justify-center ${
              orderSuccess
                ? 'bg-green-500 text-white cursor-default'
                : (!paymentMethod || finalAmount === 0 || selectedItems.length === 0)
                ? 'bg-yellow-500 opacity-50 cursor-not-allowed text-black'
                : 'bg-yellow-500 hover:bg-yellow-400 text-black'
            }`}
          >
            {isOrderLoading ? (
              <>
                <Loader size="small" className="mr-2" />
                ĐANG XỬ LÝ...
              </>
            ) : (
              getButtonText()
            )}
          </button>
        </div>
      </div>

      {showProfileUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-black">
            <div className="flex items-start mb-4">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-yellow-500 text-2xl mr-3 mt-1" />
              <div>
                <h3 className="text-xl font-bold">Thông tin cần cập nhật</h3>
                <p className="text-gray-600 mt-1">{errorMessage}</p>
              </div>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-yellow-700">Vui lòng cập nhật đầy đủ thông tin cá nhân trước khi đặt hàng:</p>
              <ul className="list-disc pl-5 mt-2 text-yellow-700">
                {!user.yourname && <li>Họ và tên</li>}
                {!user.phoneNumber && <li>Số điện thoại</li>}
                {!user.address && <li>Địa chỉ nhận hàng</li>}
              </ul>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowProfileUpdateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Để sau
              </button>
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition flex items-center"
              >
                Cập nhật ngay
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSummary;