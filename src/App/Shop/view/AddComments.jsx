import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const AddComments = ({ onClose, onSubmit, user }) => {
  const [comment, setComment] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleCommentChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 500) {
      setComment(inputValue);
      setCharCount(inputValue.length);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user.yourname) {
      alert("Vui lòng cập nhật tên của bạn (yourname) trước khi đánh giá!");
      return;
    }

    if (comment.trim() === "") {
      alert("Vui lòng nhập nội dung đánh giá!");
      return;
    }
    onSubmit(comment);
    setComment("");
    setCharCount(0);
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
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
          </div>
          <div className="relative">
            <textarea
              name="content"
              placeholder="Nội dung đánh giá"
              className="border p-2 h-44 rounded-sm w-full border-black"
              id="text"
              value={comment}
              onChange={handleCommentChange}
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