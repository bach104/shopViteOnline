import { getBaseUrl } from "../../../utils/baseURL";
const DesktopProductItem = ({
  product,
  index,
  isEditing,
  selectedProducts,
  handleCheckboxChange,
  navigateToDetail
}) => {
  const imageUrl = product.images[0]
    ? `${getBaseUrl()}/${product.images[0].replace(/\\/g, "/")}`
    : "https://via.placeholder.com/112";

  return (
    <nav key={index} className="Manager__display--product Manager__display--Tablet rounded-md h-36 justify-between p-2">
      <div className="flex ProInfor w-2/3 gap-2">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-32 w-32 object-cover border border-black rounded-s"
        />
        <div className="flex justify-between flex-col">
          <p className="line__limit--two"><b>Tên sản phẩm:</b> {product.name}</p>
          <p className="line__limit--one"><b>Tên sản phẩm:</b> {product.name}</p>
          <div>
            <p>
              <span>
                <b>Giá bán:</b> {product.price.toLocaleString()}đ
              </span>
              {product.oldPrice && (
                <s className="ml-3">{product.oldPrice.toLocaleString()}đ</s>
              )}
            </p>
            <p className="col-auto">
              <span><b>Số lượng:</b> {product.quantity}</span>
              <span className="ml-3"><b>Đã bán:</b> {product.sold}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between h-full items-end">
        <input 
          type="checkbox" 
          className="h-5 w-5"
          checked={isEditing && selectedProducts.includes(product._id)}
          onChange={() => handleCheckboxChange(product._id)}
          style={{ visibility: isEditing ? 'visible' : 'hidden' }}
        />
        <div className="flex items-end h-full">
          <button
            className="flex bg-black bg-opacity-70 hover:bg-opacity-90 transition items-center text-white px-4 py-2 rounded-sm"
            onClick={() => navigateToDetail(product._id)} 
          >
            Chi tiết sản phẩm
          </button>
        </div>
      </div>
    </nav>
  );
};
export default DesktopProductItem;