import { useUpdateCartItemMutation, useRemoveFromCartMutation } from "../../../redux/features/cart/cartApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import { getBaseUrl } from "../../../utils/baseURL"; 

const ShoppingBox = ({ cartItems = [] }) => {
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [pendingUpdates, setPendingUpdates] = useState({}); 

  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;

  if (!isLoggedIn) {
    return (
      <div className="shoppingBox w-80 border bg-white p-2 absolute top-10 -right-5 rounded-lg shadow-lg">
        <h2 className="text-center bg-slate-200 p-4 text-lg font-bold">Giỏ hàng</h2>
        <p className="text-center text-gray-500">Hãy đăng nhập để thêm sản phẩm vào giỏ hàng</p>
      </div>
    );
  }

  const displayedItems = Array.isArray(cartItems) ? cartItems.slice(0, 20) : [];

  const debouncedUpdate = debounce(async (updates) => {
    try {
      await Promise.all(updates.map(updateCartItem)); 
      setPendingUpdates({}); 
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
    }
  }, 300); 

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1; 
    const updatedItem = {
      cartItemId: item._id,
      size: item.size,
      color: item.color,
      quantity: newQuantity,
    };
    setPendingUpdates((prev) => ({ ...prev, [item._id]: updatedItem })); 
    debouncedUpdate(Object.values({ ...pendingUpdates, [item._id]: updatedItem })); 
  };

  const handleRemoveItem = async (cartItemId, event) => {
    event.stopPropagation(); 
    try {
      await removeFromCart({ cartItemId }); 
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  return (
    <div className="shoppingBox w-80 border bg-white p-2 absolute top-10 -right-5 rounded-lg shadow-lg">
      <h2 className="text-center bg-slate-200 p-4 text-lg font-bold">Giỏ hàng</h2>
      <div className="space-y-3 mt-3 max-h-60 overflow-y-auto scroll">
        {displayedItems.length > 0 ? (
          displayedItems.map((item) => {
            const imageUrl = item.image
              ? `${getBaseUrl()}/${item.image.replace(/\\/g, "/")}`
              : "https://via.placeholder.com/50"; 

            return (
              <div key={`${item._id}-${item.size}-${item.color}`} className="bg-slate-200 flex justify-between items-center p-1 shadow">
                <div className="flex items-center">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-12 h-12 object-cover"
                    loading="lazy"
                  />
                  <div className="ml-2">
                    <p className="font-semibold max-w-24 truncate">{item.name}</p>
                    <p className="text-sm">{Number(item.price).toLocaleString("vi-VN")}đ</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>

                  <span className="w-5 text-center">{item.quantity}</span>

                  <button
                    className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                  >
                    +
                  </button>

                  <button
                    className="hover:text-red-600 text-black px-2 transition-colors"
                    onClick={(event) => handleRemoveItem(item._id, event)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">Giỏ hàng trống</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingBox;