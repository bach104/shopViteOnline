import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "../../../redux/features/order/orderApi";
import { useState, useMemo } from "react";
import { getBaseUrl } from "../../../utils/baseURL";
import { toast } from "react-toastify";

const ManagerOrderPack = () => {
  const [page, setPage] = useState(1);
  const [statusFilter] = useState("Shop đang đóng gói");
  
  const { data, isLoading, isError, refetch } = useGetAllOrdersQuery({
    page,
    status: statusFilter
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const pendingOrders = useMemo(() => {
    return data?.orders || [];
  }, [data]);

  const pagination = useMemo(() => {
    return data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      ordersPerPage: 20,
      pageOrdersCount: 0
    };
  }, [data]);

  const getProductImage = (image) => {
    if (!image) return "";
    return `${getBaseUrl()}/${image.replace(/\\/g, "/")}`;
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await updateStatus({ 
        orderId, 
        status: "đã giao cho bên vận chuyển" 
      }).unwrap();
      
      toast.success("Xác nhận đơn hàng thành công");
      refetch(); 
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(error.data?.message || 'Có lỗi xảy ra khi xác nhận đơn hàng');
    }
  };

  const handleNextPage = () => {
    if (page < pagination.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const showingFrom = (page - 1) * pagination.ordersPerPage + 1;
  const showingTo = Math.min(
    page * pagination.ordersPerPage,
    pagination.totalOrders
  );

  return (
    <>
      <div className="Manager__display--Title flex justify-items-center justify-between">
        <h2 className="text-xl p-4">Các đơn hàng đang chờ xác nhận</h2>
        {pagination.totalOrders > 0 && (
          <p className="text-white p-4">
            Hiển thị {showingFrom}-{showingTo} trong tổng số {pagination.totalOrders} đơn hàng
          </p>
        )}
      </div>
      
      <div className="Manager__display--Box">
        <div className="shoppingCart relative">
          <section className="container-width p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p>Đang tải đơn hàng...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <p className="text-red-500">Có lỗi khi tải đơn hàng</p>
              </div>
            ) : pendingOrders.length === 0 ? (
              <div className="text-center py-8">
                <p>Không có đơn hàng nào đang chờ xác nhận.</p>
              </div>
            ) : (
              pendingOrders.map((order) => (
                <OrderItem 
                  key={order._id}
                  order={order}
                  getProductImage={getProductImage}
                  onConfirmOrder={handleConfirmOrder}
                  isUpdating={isUpdating}
                />
              ))
            )}
          </section>
        </div>
      </div>
      
      {pagination.totalPages > 1 && (
        <div className="flex bg-black opacity-70 justify-between p-2 gap-2">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={`bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black ${
              page === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Trang trước
          </button>
          <span className="flex items-center text-white">
            Trang {page}/{pagination.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === pagination.totalPages}
            className={`bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black ${
              page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Trang kế tiếp
          </button>
        </div>
      )}
    </>
  );
};

const OrderItem = ({ order, getProductImage, onConfirmOrder, isUpdating }) => {
  const firstProduct = order.items[0];
  const firstProductImage = firstProduct?.image ? getProductImage(firstProduct.image) : '';
  const totalProducts = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
  return (
    <div className="Manager__display--product flex h-36 gap-4 justify-between p-2 mb-4 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
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
        <p>
          <span className="text-gray-600">Trạng thái:</span> 
          <span className={`ml-1 font-medium ${
            order.status === 'Shop đang đóng gói' ? 'text-blue-500' : 
            'text-gray-600'
          }`}>
            {order.status}
          </span>
        </p>
      </div>
      
      <div className="flex items-end h-full">
        <button
          className={`flex bg-black bg-opacity-70 hover:bg-opacity-90 transition items-center text-white px-4 py-2 rounded-sm ${
            isUpdating ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          onClick={() => onConfirmOrder(order._id)}
          disabled={isUpdating}
        >
          {isUpdating ? 'Đang xử lý...' : 'Xác nhận'}
        </button>
      </div>
    </div>
  );
};

export default ManagerOrderPack;