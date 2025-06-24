import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useUpdateProductMutation } from "../../../redux/features/shop/productsApi";
import { getBaseUrl } from "../../../utils/baseURL";

const UpdateProducts = ({ product, onClose }) => {
  const categoryOptions = ["Quần bò", "Váy", "Áo", "Quần"];
  const materialOptions = ["Vải", "Kaki", "Cotton"];
  const seasonOptions = ["Đông", "Thu", "Hạ", "Xuân"];
  const isCategoryInOptions = categoryOptions.includes(product.category);
  const isMaterialInOptions = materialOptions.includes(product.material);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [formData, setFormData] = useState({
    name: product.name,
    importPrice: product.importPrice,
    oldPrice: product.oldPrice || "",
    price: product.price,
    description: product.description,
    material: isMaterialInOptions ? product.material : "Khác...",
    category: isCategoryInOptions ? product.category : "Khác...",
    quantity: product.quantity,
    size: Array.isArray(product.size) ? product.size.join(", ") : product.size,
    color: Array.isArray(product.color) ? product.color.join(", ") : product.color,
    season: product.season,
    images: product.images || [],
    video: product.video || "",
  });

  const [newImages, setNewImages] = useState([]);
  const [newVideo, setNewVideo] = useState(null);
  const [error, setError] = useState("");
  const [customCategory, setCustomCategory] = useState(
    !isCategoryInOptions ? product.category : ""
  );
  const [customMaterial, setCustomMaterial] = useState(
    !isMaterialInOptions ? product.material : ""
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = formData.images.length + newImages.length + files.length;
    if (totalImages > 15) {
      setError("Bạn chỉ có thể tải lên tối đa 15 hình ảnh.");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
    setError("");
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setNewVideo(file);
  };

  const handleRemoveImage = (index, isNewImage) => {
    if (isNewImage) {
      const updatedNewImages = newImages.filter((_, i) => i !== index);
      setNewImages(updatedNewImages);
    } else {
      const updatedImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: updatedImages });
    }
  };

  const handleRemoveVideo = () => {
    setNewVideo(null);
    setFormData({ ...formData, video: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        size: formData.size.split(",").map((s) => s.trim()),
        color: formData.color.split(",").map((c) => c.trim()),
      };

      // Xử lý trường hợp "Khác..."
      if (formData.category === "Khác..." && customCategory) {
        updatedData.category = customCategory;
      }
      if (formData.material === "Khác..." && customMaterial) {
        updatedData.material = customMaterial;
      }

      const formDataToSend = new FormData();
      Object.entries(updatedData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append("existingImages", JSON.stringify(formData.images));
      newImages.forEach((file) => {
        formDataToSend.append("images", file);
      });
      if (newVideo) {
        formDataToSend.append("video", newVideo);
      } else if (formData.video === "") {
        formDataToSend.append("video", "");
      } else {
        formDataToSend.append("video", formData.video);
      }

      await updateProduct({ id: product._id, productData: formDataToSend });
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const displayImages = [
    ...formData.images.map((img, index) => ({
      url: `${getBaseUrl()}/${img.replace(/\\/g, "/")}`,
      isNew: false,
      index,
    })),
    ...newImages.map((file, index) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      index,
    })),
  ];

  const hasExistingVideo = formData.video && typeof formData.video === "string" && formData.video.trim() !== "";
  const displayVideo = newVideo
    ? URL.createObjectURL(newVideo)
    : hasExistingVideo
    ? `${getBaseUrl()}/${formData.video.replace(/\\/g, "/")}`
    : null;
  const isMaxImagesReached = displayImages.length >= 15;

  return (
    <div className="bg-gray-200 p-6 relative rounded-lg w-full container-height  mx-auto">
      <FontAwesomeIcon
        icon={faXmark}
        className="absolute text-2xl transition hover:opacity-60 top-4 right-4 cursor-pointer"
        onClick={onClose}
      />

      <form onSubmit={handleSubmit}>
        <label className="block font-semibold">Tên sản phẩm:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 rounded mt-1"
          placeholder="Nhập tên sản phẩm"
          required
        />
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <label className="font-semibold">Loại:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="p-2 rounded w-full"
              required
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="Khác...">Khác...</option>
            </select>
            {formData.category === "Khác..." && !isCategoryInOptions && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full p-2 rounded mt-2"
                placeholder="Nhập loại sản phẩm"
                required
              />
            )}
          </div>
          <div className="flex-1">
            <label className="font-semibold">Chất Liệu:</label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="p-2 rounded w-full"
              required
            >
              {materialOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="Khác...">Khác...</option>
            </select>
            {formData.material === "Khác..." && !isMaterialInOptions && (
              <input
                type="text"
                value={customMaterial}
                onChange={(e) => setCustomMaterial(e.target.value)}
                className="w-full p-2 rounded mt-2"
                placeholder="Nhập chất liệu"
                required
              />
            )}
          </div>

          <div className="flex-1">
            <label className="font-semibold">Mùa:</label>
            <select
              name="season"
              value={formData.season}
              onChange={handleChange}
              className="p-2 rounded w-full"
              required
            >
              {seasonOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium">Giá nhập hàng</label>
            <input
              type="number"
              name="importPrice"
              value={formData.importPrice}
              onChange={handleChange}
              className="w-full p-2 rounded"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Giá cũ</label>
            <input
              type="number"
              name="oldPrice"
              value={formData.oldPrice}
              onChange={handleChange}
              className="w-full p-2 rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Giá hiện tại</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 rounded"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Số lượng</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 rounded"
              required
              min="0"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-semibold">Mô tả sản phẩm:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded"
            rows="4"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block font-semibold">Màu sắc (cách nhau bằng dấu phẩy):</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full p-2 rounded"
            placeholder="Ví dụ: Đỏ, Xanh, Vàng"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold">Kích thước (cách nhau bằng dấu phẩy):</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full p-2 rounded"
            placeholder="Ví dụ: S, M, L"
            required
          />
        </div>
              
        <div className="mt-4">
          <label className="block font-semibold">Ảnh (Tối đa 15 ảnh):</label>
          <div className="flex gap-4 flex-wrap">
            {displayImages.map((img, index) => (
              <div key={index} className="relative w-20 h-20 bg-gray-300 flex items-center justify-center rounded">
                <img
                  src={img.url}
                  alt={`Ảnh ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  onClick={() => handleRemoveImage(index, img.isNew)}
                >
                  &times;
                </button>
              </div>
            ))}
            {!isMaxImagesReached && (
              <label className="w-20 h-20 bg-gray-500 flex items-center justify-center rounded cursor-pointer">
                <span className="text-white text-2xl">+</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="mt-4">
          <label className="block font-semibold">Video:</label>
          <div className="flex flex-col gap-2">
            <div className="w-40 h-32 bg-gray-300 flex items-center justify-center rounded">
              {displayVideo ? (
                <video
                  src={displayVideo}
                  controls
                  className="h-full w-full object-cover rounded"
                />
              ) : (
                <p>Chưa có video</p>
              )}
            </div>
            <div className="flex gap-2">
              <label className="bg-black text-white px-4 py-2 transition hover:opacity-60 opacity-80 rounded cursor-pointer">
                {hasExistingVideo || newVideo ? "Thay đổi video" : "Thêm video"}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>
              {(hasExistingVideo || newVideo) && (
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleRemoveVideo}
                >
                  Xóa video
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 transition hover:opacity-60 opacity-80 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProducts;