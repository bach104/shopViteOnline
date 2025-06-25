import { useState } from "react";
import avatarImg from "../../../assets/img/avatar.png";
import { useSelector } from "react-redux";
import { getBaseUrl } from "../../../utils/baseURL";

const Comment = ({ comment, onDelete, onEdit, onReply, isReply = false }) => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showAllReplies, setShowAllReplies] = useState(false);
  const isCurrentUserComment =
    user && comment && user._id?.toString() === comment.userId?._id?.toString();

  const handleSaveEdit = () => {
    onEdit(comment._id, editedContent);
    setIsEditing(false);
  };

  const handleReply = () => {
    if (!user) {
      alert("Bạn cần đăng nhập để trả lời đánh giá!");
      return;
    }
    setIsReplying((prev) => !prev);
  };

  const handleSubmitReply = () => {
    if (replyContent.trim() === "") {
      alert("Vui lòng nhập nội dung trả lời!");
      return;
    }
    onReply(comment._id, replyContent);
    setIsReplying(false);
    setReplyContent("");
  };

  const avatarUrl = comment.avatar
    ? `${getBaseUrl()}/${comment.avatar.replace(/\\/g, "/")}`
    : avatarImg;

  const initialRepliesToShow = 2;
  const repliesToShow = showAllReplies
    ? comment.replies
    : comment.replies?.slice(0, initialRepliesToShow);

  return (
    <div className={`p-3 bg-gray-100 rounded-md mb-2 ${isReply ? "ml-6" : ""}`}>
      <div className="flex items-start space-x-3">
        <img
          src={avatarUrl}
          className="w-10 h-10 rounded-full"
          alt="Avatar"
          onError={(e) => (e.target.src = avatarImg)}
        />
        <div className="w-full">
          <p className="font-bold text-sm">{comment.yourname}</p>
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          ) : (
            <p className="text-gray-700 text-sm">{comment.content}</p>
          )}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
            <div className="flex space-x-2">
              {isCurrentUserComment && (
                <>
                  <p
                    className="hover:text-blue-500 font-bold cursor-pointer"
                    onClick={() => onDelete(comment._id)}
                  >
                    Xoá
                  </p>
                  {isEditing ? (
                    <p
                      className="hover:text-blue-500 font-bold cursor-pointer"
                      onClick={handleSaveEdit}
                    >
                      Lưu
                    </p>
                  ) : (
                    <p
                      className="hover:text-blue-500 font-bold cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    >
                      Sửa
                    </p>
                  )}
                </>
              )}
              <p
                className="hover:text-blue-500 font-bold cursor-pointer"
                onClick={handleReply}
              >
                Trả lời
              </p>
            </div>
          </div>
          {isReplying && (
            <div className="mt-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Nhập nội dung trả lời..."
              />
              <button
                onClick={handleSubmitReply}
                className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-md"
              >
                Gửi
              </button>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {repliesToShow.map((reply) => (
            <Comment
              key={reply._id || `temp-reply-${Date.now()}`}
              comment={reply}
              onDelete={onDelete}
              onEdit={onEdit}
              onReply={onReply}
              isReply={true}
            />
          ))}
          {comment.replies.length > initialRepliesToShow && (
            <button
              onClick={() => setShowAllReplies(!showAllReplies)}
              className="text-sm text-blue-500 font-semibold mt-2"
            >
              {showAllReplies ? "Ẩn bớt" : `Xem thêm ${comment.replies.length - initialRepliesToShow} phản hồi`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;