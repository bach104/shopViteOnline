import { useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAddProductMutation } from "../../../redux/features/shop/productsApi";

const AddProducts = ({ onClose }) => {
  const [name, setName] = useState("");
  const [importPrice, setImportPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [season, setSeason] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const [customCategory, setCustomCategory] = useState(""); 
  const [customMaterial, setCustomMaterial] = useState(""); 

  const [addProduct] = useAddProductMutation();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 15) {
      setError("Tối đa được phép có 15 hình ảnh.");
      return;
    }
    setImages([...images, ...files]);
    setError("");
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleRemoveVideo = () => {
    setVideo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || name.trim() === "") {
      setError("Vui lòng nhập Tên sản phẩm.");
      return;
    }
    if (
      !importPrice ||
      !price ||
      !description ||
      !material ||
      !category ||
      !size ||
      !season ||
      !color ||
      quantity === undefined
    ) {
      setError("Vui lòng cung cấp đầy đủ thông tin sản phẩm.");
      return;
    }
    if (images.length < 3) {
      setError("Cần ít nhất 3 hình ảnh.");
      return;
    }
    if (images.length > 15) {
      setError("Tối đa được phép có 15 hình ảnh.");
      return;
    }

    const finalCategory = category === "Khác..." && customCategory ? customCategory : category;
    const finalMaterial = material === "Khác..." && customMaterial ? customMaterial : material;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("importPrice", parseFloat(importPrice));
    if (oldPrice) formData.append("oldPrice", parseFloat(oldPrice)); 
    formData.append("price", parseFloat(price));
    formData.append("description", description);
    formData.append("material", finalMaterial);
    formData.append("category", finalCategory);
    formData.append("quantity", parseInt(quantity));
    formData.append("size", size);
    formData.append("color", color);
    formData.append("season", season);
    images.forEach((image) => {
      formData.append("images", image);
    });
    if (video) formData.append("video", video);

    try {
      const response = await addProduct(formData).unwrap();
      console.log("Sản phẩm đã được thêm:", response)
      onClose();
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      setError(err.data?.message || "Lỗi khi thêm sản phẩm.");
    }
  };

  return (
    <div className="bg-gray-200 p-6 relative rounded-lg w-full max-w-4xl mx-auto">
      <FontAwesomeIcon
        icon={faXmark}
        className="absolute text-2xl transition hover:opacity-60 top-4 right-4 cursor-pointer"
        onClick={onClose}
      />
      <form onSubmit={handleSubmit}>
        <label className="block font-semibold">Tên sản phẩm:</label>
        <input
          type="text"
          className="w-full p-2 rounded mt-1"
          placeholder="Nhập tên sản phẩm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <label className="font-semibold">Loại:</label>
            <select
              className="p-2 rounded w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Lựa chọn</option>
              <option value="Quần bò">Quần bò</option>
              <option value="Váy">Váy</option>
              <option value="Áo">Áo</option>
              <option value="Quần">Quần</option>
              <option value="Set đồ nữ">Set đồ nữ</option>
              <option value="Set đồ nam">Set đồ nam</option>
              <option value="Khác...">Khác...</option>
            </select>
            {category === "Khác..." && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full p-2 rounded mt-2"
                placeholder="Nhập loại sản phẩm"
              />
            )}
          </div>

          <div className="flex-1">
            <label className="font-semibold">Chất Liệu:</label>
            <select
              className="p-2 rounded w-full"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              required
            >
              <option value="">Lựa chọn</option>
              <option value="Vải">Vải</option>
              <option value="Kaki">Kaki</option>
              <option value="Cotton">Cotton</option>
              <option value="Khác...">Khác...</option>
            </select>
            {material === "Khác..." && (
              <input
                type="text"
                value={customMaterial}
                onChange={(e) => setCustomMaterial(e.target.value)}
                className="w-full p-2 rounded mt-2"
                placeholder="Nhập chất liệu"
              />
            )}
          </div>

          <div className="flex-1">
            <label className="font-semibold">Mùa:</label>
            <select
              className="p-2 rounded w-full"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              required
            >
              <option value="">Lựa chọn</option>
              <option value="Đông">Đông</option>
              <option value="Thu">Thu</option>
              <option value="Hạ">Hạ</option>
              <option value="Xuân">Xuân</option>
              <option value="Đông Thu Hạ Xuân">Tất cả</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="number"
            className="p-2 rounded"
            placeholder="Giá nhập hàng"
            value={importPrice}
            onChange={(e) => setImportPrice(e.target.value)}
            required
          />
          <input
            type="number"
            className="p-2 rounded"
            placeholder="Giá cũ"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
          />
          <input
            type="number"
            className="p-2 rounded"
            placeholder="Giá hiện tại"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="number"
            className="p-2 rounded"
            placeholder="Số lượng"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <textarea
            className="w-full p-2 rounded"
            placeholder="Mô tả sản phẩm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mt-4">
          <label className="block font-semibold">Màu sắc:</label>
          <input
            type="text"
            className="w-full p-2 rounded"
            placeholder="Nhập màu sắc cách nhau bằng dấu phẩy"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold">Kích thước:</label>
          <input
            type="text"
            className="w-full p-2 rounded"
            placeholder="Nhập size cách nhau bằng dấu phẩy"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold">Ảnh:</label>
          <div className="flex gap-4 flex-wrap">
            {images.map((image, index) => (
              <div key={index} className="relative w-20 h-20 bg-gray-500 flex items-center justify-center rounded">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Ảnh ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  onClick={() => handleRemoveImage(index)}
                >
                  &times;
                </button>
              </div>
            ))}
            {images.length < 15 && (
              <label className="w-20 h-20 bg-gray-500 flex items-center justify-center rounded cursor-pointer">
                <span className="text-white text-2xl">+</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="mt-4">
          <label className="block font-semibold">Video:</label>
          {video ? (
            <div className="relative w-32 h-20 bg-gray-500 flex items-center justify-center rounded">
              <video
                src={URL.createObjectURL(video)}
                className="w-full h-full object-cover rounded"
                controls
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                onClick={handleRemoveVideo}
              >
                &times;
              </button>
            </div>
          ) : (
            <label className="w-32 h-20 bg-gray-500 flex items-center justify-center rounded cursor-pointer">
              <span className="text-white">Thêm video</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoChange}
              />
            </label>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 transition hover:opacity-60 opacity-80 mt-6 rounded"
          >
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;