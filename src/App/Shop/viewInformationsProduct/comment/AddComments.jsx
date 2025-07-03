import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRateProductMutation } from "../../../../redux/features/shop/productsApi";

const AddComments = ({ onClose, onSubmit, user, productId }) => {
  const [comment, setComment] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [star, setStar] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [rateProduct] = useRateProductMutation();

  const handleCommentChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 500) {
      setComment(inputValue);
      setCharCount(inputValue.length);
    }
  };

  const handleStarClick = (selectedStar) => {
    setStar(selectedStar);
  };
ư
  const handleStarHover = (hoverValue) => {
    setHoverStar(hoverValue);
  };

  const handleStarLeave = () => {
    setHoverStar(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.yourname) {
      alert("Vui lòng cập nhật tên của bạn (yourname) trước khi đánh giá!");
      return;
    }

    if (comment.trim() === "") {
      alert("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    if (star === 0) {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }

    try {
      // Gửi đánh giá sao
      await rateProduct({ productId, star }).unwrap();
      
      // Gửi nội dung đánh giá
      onSubmit(comment);
      
      // Reset form
      setComment("");
      setCharCount(0);
      setStar(0);
    } catch (error) {
      console.error("Lỗi khi đánh giá:", error);
      alert("Đã có lỗi xảy ra khi đánh giá. Vui lòng thử lại!");
    }
  };

  return (
    <div className="cart__container rounded-sm top-0 right-0 z-30">
      <div className="cart__update absolute bg-white z-50 p-4">
        <h2 className="text-2xl font-bold pb-3">Đánh giá</h2>
        
        <FontAwesomeIcon
          icon={faXmark}
          className="absolute top-4 text-2xl transition hover:opacity-60 cursor-pointer right-4"
          onClick={onClose}
        />
        <form onSubmit={handleSubmit} className="flex gap-2 flex-col">
          <div className="text-3xl mb-3">
            {[1, 2, 3, 4, 5].map((value) => (
              <i
                key={value}
                className={`fa-star cursor-pointer ${
                  value <= (hoverStar || star) ? "fa-solid text-yellow-400" : "fa-regular"
                }`}
                onClick={() => handleStarClick(value)}
                onMouseEnter={() => handleStarHover(value)}
                onMouseLeave={handleStarLeave}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {star > 0 ? `Bạn đã chọn ${star} sao` : "Vui lòng chọn số sao"}
            </span>
          </div>
          <div className="relative">
            <textarea
              name="content"
              placeholder="Nội dung đánh giá"
              className="border p-2 h-44 rounded-sm w-full border-black"
              id="text"
              value={comment}
              onChange={handleCommentChange}
              required
            />
            <p className="absolute top-2 right-2 text-sm text-gray-500">
              {charCount}/500
            </p>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black rounded-sm opacity-80 hover:opacity-60 transition text-white px-4 py-2"
            >
              Đánh giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddComments;