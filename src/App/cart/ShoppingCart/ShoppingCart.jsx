import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useFetchCartQuery, useRemoveFromCartMutation } from "../../../redux/features/cart/cartApi";
import CartSummary from "./CartSummary";
import CartUpdate from "./CartUpdate";
import { useSelector } from "react-redux";
import { getBaseUrl } from "../../../utils/baseURL"; 

const ShoppingCart = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const itemsPerPage = 20;

  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const { data: cartData, isLoading, isError, refetch } = useFetchCartQuery(
    {
      page: currentPage,
      limit: itemsPerPage,
    },
    { skip: !isLoggedIn }
  );

  const [removeFromCart] = useRemoveFromCartMutation();

  const handleOrderSuccess = () => {
    refetch(); // Làm mới danh sách giỏ hàng
  };

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);
  const handleSelectItem = (itemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };
  const handleClearSelection = () => setSelectedItems([]);

  const handleRemoveSelected = async () => {
    try {
      await removeFromCart({ cartItemIds: selectedItems }).unwrap();
      setSelectedItems([]);
      refetch();
    } catch (error) {
      console.error("Failed to remove items:", error);
    }
  };

  const selectedProducts = cartData?.cartItems?.filter((item) => selectedItems.includes(item._id)) || [];
  const totalQuantity = selectedProducts.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="my-4 shoppingCart relative">
      <section className="container-width p-4">
        <div className="flex justify-between pb-2">
          <h2 className="text-2xl">Đơn hàng của tôi</h2>
          <p
            className="hover:text-red-500 cursor-pointer"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Xong" : "Sửa"}
          </p>
        </div>

        {isEditing && (
          <h3 className="text-center text-xl text-black opacity-80 font-semibold">
            Chọn sản phẩm để xóa
          </h3>
        )}

        <div className="space-y-3 shoppingContainer">
          {isLoading ? (
            <div className="text-center py-4 text-lg text-gray-500">Đang tải...</div>
          ) : isError ? (
            <div className="text-center py-4 text-lg text-red-500">Lỗi khi tải giỏ hàng</div>
          ) : !isLoggedIn ? (
            <div className="text-center py-4 text-lg font-semibold text-gray-500">
              Mời bạn đăng nhập để xem sản phẩm
            </div>
          ) : cartData.cartItems.length === 0 ? (
            <div className="text-center py-4 text-lg font-semibold text-gray-500">
              Giỏ hàng trống
            </div>
          ) : (
            cartData.cartItems.map((item) => {
              const imageUrl = item.image
                ? `${getBaseUrl()}/${item.image.replace(/\\/g, "/")}`
                : "https://via.placeholder.com/112"; 

              return (
                <div
                  key={item._id}
                  className="flex shoppingItems gap-2 h-32 bg__select p-2 rounded-sm mb-3 shadow-sm"
                >
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-28 border border-black h-full object-cover rounded-s"
                  />
                  <div className="flex-1 shoppingItems__technology">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm">Số lượng: {item.quantity}</p>
                    <p className="text-sm">Kích thước: {item.size}</p>
                    <p className="text-sm">Màu sắc: {item.color}</p>
                    <p className="text-sm shoppingItems__technology--price gap-2 font-semibold">
                      {item.price}đ
                      <s className="pl-2  opacity-50">{item.oldPrice}đ</s>
                    </p>
                  </div>
                  <div className="flex flex-col shoppingItems__click items-end justify-between">
                    <input
                      type="checkbox"
                      className="w-5 h-5 cursor-pointer bg-gray-300 checked:bg-black"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleSelectItem(item._id)}
                    />
                    <button
                      className="bg-black hover:opacity-70 opacity-80 transition text-white rounded-lg"
                      onClick={() => {
                        setSelectedItemId(item._id); 
                        setShowUpdate(true);
                      }}
                    >
                      Thay đổi
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {isLoggedIn && cartData?.cartItems.length > 0 && (
          <div className="flex py-4 justify-between items-center">
            <p>Tổng số lượng đơn: {cartData?.totalItems || 0}</p>
            <div className="flex items-center space-x-4">
              {currentPage > 1 && (
                <p
                  className="font-semibold cursor-pointer hover:text-red-500"
                  onClick={handlePrevPage}
                >
                  <FontAwesomeIcon className="pr-2 text-sm" icon={faChevronRight} rotation={180} />
                  Trang trước
                </p>
              )}
              {cartData?.currentPage < cartData?.totalPages && (
                <p
                  className="font-semibold cursor-pointer hover:text-red-500"
                  onClick={handleNextPage}
                >
                  Trang tiếp theo
                  <FontAwesomeIcon className="pl-2 text-sm" icon={faChevronRight} />
                </p>
              )}
            </div>
          </div>
        )}

        {isEditing && selectedItems.length > 0 && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:opacity-80 transition flex items-center"
              onClick={handleRemoveSelected}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Xóa sản phẩm đã chọn
            </button>
          </div>
        )}

        <CartSummary
          totalQuantity={totalQuantity}
          totalPrice={totalPrice}
          onClearSelection={handleClearSelection}
          selectedItems={selectedItems}
          onOrderSuccess={handleOrderSuccess}
        />
      </section>

      {showUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <CartUpdate
            onClose={() => setShowUpdate(false)}
            product={cartData.cartItems.find((item) => item._id === selectedItemId)}
          />
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;