import { useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUpdateCartItemMutation } from "../../../redux/features/cart/cartApi";
import { useGetProductByIdQuery } from "../../../redux/features/shop/productsApi";
import { getBaseUrl } from "../../../utils/baseURL"; 

const CartUpdate = ({ onClose, product }) => {
  const [size, setSize] = useState(product.size);
  const [color, setColor] = useState(product.color);
  const [quantity, setQuantity] = useState(product.quantity);

  const { data: productDetails, isLoading: isProductLoading } = useGetProductByIdQuery(product.productId);

  const [updateCartItem] = useUpdateCartItemMutation();

  const handleUpdate = async () => {
    try {
      await updateCartItem({
        cartItemId: product._id,
        size,
        color,
        quantity,
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
    }
  };

  if (isProductLoading) {
    return <div className="text-center py-4 text-lg text-gray-500">Đang tải thông tin sản phẩm...</div>;
  }

  if (!productDetails || !productDetails.product) {
    return <div className="text-center py-4 text-lg text-red-500">Không tìm thấy thông tin sản phẩm</div>;
  }

  const { color: colors, size: sizes } = productDetails.product;

  const imageUrl = product.image
    ? `${getBaseUrl()}/${product.image.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/240"; 

  return (
    <div className="cart__container p-2">
      <div className="cart__update p-6 border relative rounded-lg shadow-md bg-white">
        <FontAwesomeIcon
          icon={faXmark}
          className="absolute transition text-2xl hover:scale-125 top-4 right-4 cursor-pointer"
          onClick={onClose}
        />
        <h2 className="text-xl font-semibold mb-4">Cập nhật</h2>
        <div className="flex cart__wrap gap-6">
          {/* Hiển thị hình ảnh */}
          <img
            src={imageUrl}
            alt={product.name}
            className="w-60 h-60 block object-cover rounded-lg border"
          />
          <div className="flex flex-col flex-1 gap-3">
            <p className="text-lg font-medium">Tên sản phẩm: {product.name}</p>

            <div className="flex items-center flex-wrap gap-2">
              <span className="font-medium">Kích thước:</span>
              {sizes?.length > 0 ? (
                sizes.map((sz) => (
                  <button
                    key={sz}
                    className={`px-3 py-1 border rounded ${
                      size === sz ? "bg-black text-white" : "bg-gray-200"
                    }`}
                    onClick={() => setSize(sz)}
                  >
                    {sz}
                  </button>
                ))
              ) : (
                <p>Không có kích thước nào</p>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <span className="font-medium">Màu sắc:</span>
              {colors?.length > 0 ? (
                colors.map((clr) => (
                  <button
                    key={clr}
                    className={`px-3 py-1 border rounded ${
                      color === clr ? "bg-black text-white" : "bg-gray-200"
                    }`}
                    onClick={() => setColor(clr)}
                  >
                    {clr}
                  </button>
                ))
              ) : (
                <p>Không có màu sắc nào</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Số lượng:</span>
              <button
                className="px-2 py-1 border rounded"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                className="px-2 py-1 border rounded"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>

            <div className="flex w-full justify-end">
              <button
                className="mt-4 px-6 transition py-2 hover:opacity-80 bg-black text-white rounded"
                onClick={handleUpdate}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartUpdate;