import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../../redux/features/shop/productsApi";
import UpdateProducts from "./updateProducts";
import { getBaseUrl } from "../../../utils/baseURL";
const InformationProducts = () => {
  const { id } = useParams();
  const { data: productData, isLoading, isError } = useGetProductByIdQuery(id);
  const [showUpdateProducts, setShowUpdateProducts] = useState(false);

  const handleEdit = () => {
    setShowUpdateProducts(true);
  };
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading product details</div>;
  if (!productData || !productData.product) return <div>Không tìm thấy sản phẩm</div>;

  const product = productData.product;
  const videoUrl = product?.video?.[0]
    ? `${getBaseUrl()}/${product.video[0].replace(/\\/g, "/")}`
    : null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="relative container-height container-width bg-gray-100 px-6 py-8 rounded-lg shadow-md">
          <FontAwesomeIcon
            icon={faXmark}
            className="absolute top-4 right-4 cursor-pointer text-2xl hover:opacity-50 transition"
            onClick={() => window.history.back()}
          />
          <h2 className="text-xl"><b>Tên sản phẩm:</b> {product.name}</h2>
          <div className="mt-4">
            <p className="font-semibold">Ảnh</p>
            <div className="flex flex-wrap gap-2">
              {product.images.map((img, index) => {
                const imageUrl = img ? `${getBaseUrl()}/${img.replace(/\\/g, "/")}` : "https://via.placeholder.com/112";
                return (
                  <div key={index} className="w-32 h-32 bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={`Ảnh ${index + 1} của sản phẩm`}
                      className="w-full h-full object-cover block"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <p className="font-semibold">Video:</p>
            <div className="w-40 h-32 bg-gray-300 flex items-center justify-center">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : (
                <p>Không có video</p>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <p><strong>Loại:</strong> {product.category}</p>
            <p><strong>Mùa:</strong> {product.season}</p>
            <p><strong>Chất liệu:</strong> {product.material}</p>
          </div>

          <div className="mt-4">
            <p><strong>Giá nhập:</strong> {product.importPrice}đ</p>
            <p><strong>Giá cũ:</strong> {product.oldPrice ? `${product.oldPrice}đ` : "Không có"}</p>
            <p><strong>Giá:</strong> {product.price}đ</p>
          </div>

          <div className="mt-4">
            <strong>Mô tả:</strong>
            <p className="scroll__managerProduct">
              {product.description}
            </p>
          </div>

          <div className="mt-4">
            <p><strong>Số lượng:</strong> {product.quantity}</p>
            <p><strong>Đã bán:</strong> {product.sold}</p>
          </div>

          <div className="mt-4">
            <p><strong>Màu sắc:</strong> {product.color.join(", ")}</p>
          </div>

          <div className="mt-4">
            <p><strong>Kích thước:</strong> {product.size.join(", ")}</p>
          </div>
          <div className="flex justify-end">
            <button
              className="mt-6 px-4 py-2 bg-black text-white rounded"
              onClick={handleEdit}
            >
              Sửa thông tin
            </button>
          </div>
        </div>
      </div>

      {showUpdateProducts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <UpdateProducts
            product={{
              ...product,
              video: product?.video?.[0] || "",
            }}
            onClose={() => setShowUpdateProducts(false)}
          />
        </div>
      )}
    </>
  );
};
export default InformationProducts;