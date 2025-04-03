import { useSelector } from "react-redux";
import { getBaseUrl } from "../../../utils/baseURL"; 

const ShoppingBox = ({ cartItems = [] }) => {
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
                <div className="">
                  <span className="w-5 text-center mr-3">Số lượng: {item.quantity}</span>
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