import { useState } from 'react';
import { useCreateVnpayPaymentMutation } from '../../../redux/features/bank/bankApi';
import { useDispatch, useSelector } from 'react-redux';
import { paymentStart, selectPaymentStatus } from '../../../redux/features/bank/bankSlice';
import Loader from './Loader';
import { toast } from 'react-hot-toast';

const CartSummary = ({ totalQuantity, totalPrice, onClearSelection }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [createPayment, { isLoading }] = useCreateVnpayPaymentMutation();
  const dispatch = useDispatch();
  const paymentStatus = useSelector(selectPaymentStatus);

  const price = Number(totalPrice) || 0;
  const shippingFee = price * 0.05;
  const finalAmount = Math.round(price + shippingFee);

  const handlePayment = async () => {
    if (finalAmount < 10000) {
      toast.error('Số tiền thanh toán tối thiểu là 10,000 VND');
      return;
    }

    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    dispatch(paymentStart());
    
    try {
      const response = await createPayment({
        amount: finalAmount,
        bankCode: paymentMethod === 'vnpay_qr' ? 'VNPAYQR' : 'VNBANK',
        orderInfo: `Thanh toán ${totalQuantity} sản phẩm`
      }).unwrap();

      console.log('Payment response:', response); // For debugging

      if (response.code === '00' && response.data?.paymentUrl) {
        // Lưu thông tin giao dịch vào localStorage
        localStorage.setItem('currentPayment', JSON.stringify({
          amount: finalAmount,
          items: totalQuantity,
          orderId: response.data.orderId,
          timestamp: new Date().toISOString()
        }));
        
        // Redirect to VNPay payment page
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error(response.message || 'Khởi tạo thanh toán thất bại');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.data?.message || 'Lỗi hệ thống khi tạo thanh toán');
    }
  };

  const paymentMethods = [
    { id: 'vnpay_qr', label: 'VNPay QR', icon: 'qr_code' },
    { id: 'vnpay_card', label: 'Thẻ ngân hàng', icon: 'credit_card' },
  ];

  return (
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
            <span className="font-medium">
              {price.toLocaleString('vi-VN')} ₫
            </span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span className="font-medium">
              {shippingFee.toLocaleString('vi-VN')} ₫
            </span>
          </div>
          <div className="flex justify-between text-lg mt-2 pt-2 border-t border-gray-700">
            <span className="font-semibold">Tổng cộng:</span>
            <span className="font-bold text-yellow-400">
              {finalAmount.toLocaleString('vi-VN')} ₫
            </span>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-3">PHƯƠNG THỨC THANH TOÁN</h3>
        
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div 
              key={method.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                paymentMethod === method.id 
                  ? 'border-yellow-400 bg-gray-800' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => setPaymentMethod(method.id)}
            >
              <div className="flex items-center">
                <span className="material-icons-round mr-3">{method.icon}</span>
                <span>{method.label}</span>
                {paymentMethod === method.id && (
                  <span className="ml-auto text-green-400 material-icons-round">check_circle</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={onClearSelection}
          className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
        >
          Xóa lựa chọn
        </button>
        
        <button
          onClick={handlePayment}
          disabled={!paymentMethod || isLoading || finalAmount === 0}
          className={`py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition flex items-center justify-center ${
            (!paymentMethod || finalAmount === 0) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading || paymentStatus === 'loading' ? (
            <>
              <Loader size="small" className="mr-2" />
              ĐANG XỬ LÝ...
            </>
          ) : (
            `THANH TOÁN ${finalAmount.toLocaleString('vi-VN')} ₫`
          )}
        </button>
      </div>
    </div>
  );
};

export default CartSummary;