const ProductInfo = ({ 
  product, 
  selectedSize, 
  setSelectedSize, 
  selectedColor, 
  setSelectedColor,
  quantity,
  setQuantity,
  addToCartHandler
}) => {
  return (
    <div className="col-span-2 InforText">
      <h2 className="text-3xl font-bold InforText__title">{product.name}</h2>
      <p className="mt-2 InforText__price text-lg font-bold">
        {product.price?.toLocaleString("vi-VN")}đ{" "}
        {product.oldPrice && (
          <span className="text-gray-600 line-through text-sm">
            {product.oldPrice.toLocaleString("vi-VN")}đ
          </span>
        )}
      </p>
      <div className="InforText__description">
        <h4 className="font-bold mt-2">Mô tả sản phẩm</h4>
        <div className="scroll__viewInformation mx-2 mt-2 rounded">
          <p>{product.description}</p>
        </div>
      </div>
      <div className="mt-4 InforText__size gap-4">
        <p className="text-sm font-semibold">Size:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {product.size?.map((size) => (
            <button
              key={size}
              className={`border border-black px-2 py-0.5 rounded ${
                selectedSize === size ? "bg-black text-white" : ""
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 gap-4">
        <p className="text-sm w-36 font-semibold">Màu sắc:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {product.color?.map((color) => (
            <button
              key={color}
              className={`border border-black px-2 py-0.5 rounded ${
                selectedColor === color ? "bg-black text-white" : ""
              }`}
              onClick={() => setSelectedColor(color)}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
      <div className="flex mt-2 gap-2">
        <p className="bg-black text-white px-2 py-1 rounded-md">Kho: {product.quantity}</p>
        <p className="bg-black text-white px-2 py-1 rounded-md">Đã bán: {product.sold}</p>
      </div>
      <div className="mt-2 flex items-center">
        <p className="text-sm font-semibold mr-2">Số lượng:</p>
        <div>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="bg-black opacity-80 text-white w-6 rounded"
          >
            -
          </button>
          <span className="mx-2">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="bg-black opacity-80 text-white w-6 rounded"
          >
            +
          </button>
        </div>
      </div>
      <div className="InforText__btn">
        <button
            className="mt-4 bg-black text-white px-6 py-2 rounded"
            onClick={addToCartHandler}
        >
            Thêm vào giỏ hàng
        </button>
      </div>
       <div className="p-1 mt-3 InforText__description2">
        <h4 className="font-bold">Mô tả sản phẩm</h4>
        <div className="scroll__viewInformation mt-2 rounded">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;