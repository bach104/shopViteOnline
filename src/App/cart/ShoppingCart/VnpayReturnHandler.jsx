import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setVnpayReturnParams } from '../../../redux/features/bank/bankSlice';
import { toast } from 'react-toastify';
import Loader from './Loader';

const VnpayReturnHandler = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        console.log("VNPay return params:", params); // For debugging

        dispatch(setVnpayReturnParams(params));
        const paymentInfo = JSON.parse(localStorage.getItem('currentPayment') || '{}');
        
        if (params.vnp_ResponseCode === '00') {
          toast.success(
            <div>
              <h3 className="font-bold">THANH TOÁN THÀNH CÔNG!</h3>
              <p>Số tiền: {(Number(params.vnp_Amount) / 100).toLocaleString('vi-VN')} ₫</p>
              <p>Mã giao dịch: {params.vnp_TransactionNo}</p>
              <p>Số sản phẩm: {paymentInfo.items || 'N/A'}</p>
            </div>,
            { autoClose: 5000 }
          );
          
          localStorage.removeItem('currentPayment');
          
          setTimeout(() => {
            navigate('/cart-manager/confirmation', { replace: true });
          }, 3000);
        } else {
          setError(`Thanh toán thất bại: ${params.vnp_ResponseCode}`);
          toast.error(
            <div>
              <h3 className="font-bold">THANH TOÁN KHÔNG THÀNH CÔNG</h3>
              <p>Mã lỗi: {params.vnp_ResponseCode || 'Không xác định'}</p>
              <p>Lý do: {params.vnp_Message || 'Không có thông tin'}</p>
            </div>,
            { autoClose: 5000 }
          );
          
          setTimeout(() => {
            navigate('/cart-manager', { replace: true });
          }, 3000);
        }
      } catch (err) {
        console.error('Error processing payment result:', err);
        setError('Có lỗi xảy ra khi xử lý kết quả thanh toán');
      } finally {
        setLoading(false);
      }
    };

    processPaymentResult();
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md w-full">
        {loading ? (
          <>
            <Loader size="large" />
            <h2 className="text-xl font-semibold mt-4">
              ĐANG XỬ LÝ KẾT QUẢ THANH TOÁN...
            </h2>
            <p className="mt-2 text-gray-600">Vui lòng chờ trong giây lát</p>
          </>
        ) : error ? (
          <div className="text-red-600">
            <h2 className="text-xl font-semibold">CÓ LỖI XẢY RA</h2>
            <p className="mt-2">{error}</p>
            <button
              onClick={() => navigate('/cart-manager')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Quay lại giỏ hàng
            </button>
          </div>
        ) : (
          <div className="text-green-600">
            <h2 className="text-xl font-semibold">ĐANG CHUYỂN HƯỚNG...</h2>
            <p className="mt-2">Vui lòng không đóng trang này</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VnpayReturnHandler;