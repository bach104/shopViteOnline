import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
} from "../../../redux/features/comment/commentApi";
import AddComments from "./AddComments";
import Comment from "./Comment";

const Comments = ({ productId }) => {
  const [showAddComments, setShowAddComments] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading, isError } = useGetCommentsQuery({ productId, page, limit });
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [editComment] = useEditCommentMutation();
  const { user } = useSelector((state) => state.auth);
  const [localComments, setLocalComments] = useState([]);

  // Sắp xếp bình luận khi nhận dữ liệu từ API
  useEffect(() => {
    if (!isLoading && !isError && data?.comments) {
      // Tạo bản sao của mảng và sắp xếp theo thời gian tạo giảm dần (createdAt)
      const sortedComments = [...data.comments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLocalComments(sortedComments);
    }
  }, [data, isLoading, isError]);

  const handleCommentClick = () => {
    if (!user) {
      alert("Bạn cần đăng nhập để bình luận!");
      return;
    }
    setShowAddComments((prev) => !prev);
  };

  const handleCloseComments = () => {
    setShowAddComments(false);
  };

  const handleAddComment = async (comment) => {
    if (!user) {
      alert("Bạn cần đăng nhập để bình luận!");
      return;
    }

    try {
      const newComment = await addComment({
        content: comment,
        productId,
        userId: user._id,
        yourname: user.yourname,
        avatar: user.avatar,
      }).unwrap();

      const commentWithId = { ...newComment };
      if (!commentWithId._id) {
        commentWithId._id = `temp-${Date.now()}`;
      }

      // Thêm bình luận mới vào đầu danh sách
      setLocalComments((prevComments) => {
        const updatedComments = [commentWithId, ...prevComments];
        // Nếu đang ở trang 1, cập nhật ngay lập tức
        if (page === 1) {
          return updatedComments;
        }
        // Nếu đang ở các trang khác, vẫn thêm bình luận mới nhưng không hiển thị ngay
        return updatedComments;
      });

      setShowAddComments(false);

      // Nếu đang ở các trang khác, thông báo cho người dùng quay lại trang 1
      if (page !== 1) {
        alert("Bình luận mới đã được thêm. Vui lòng quay lại trang 1 để xem.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId).unwrap();
      setLocalComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Lỗi khi xoá bình luận:", error);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    if (!commentId || !newContent.trim()) {
      console.error("ID bình luận hoặc nội dung không hợp lệ!");
      return;
    }
    try {
      await editComment({
        commentId,
        content: newContent,
        userId: user._id,
        productId,
      }).unwrap();
      setLocalComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, content: newContent } : comment
        )
      );
    } catch (error) {
      console.error("Lỗi khi sửa bình luận:", error);
    }
  };

  const handleReplyComment = async (parentId, content) => {
    if (!user) {
      alert("Bạn cần đăng nhập để trả lời bình luận!");
      return;
    }

    try {
      const parentComment = localComments.find(
        (comment) => comment._id === parentId || comment.replies?.some(reply => reply._id === parentId)
      );

      if (!parentComment) return;

      const replyContent =
        parentComment._id === parentId
          ? content
          : `@${parentComment.yourname} ${content}`;

      const newReply = await addComment({
        id: user._id,
        content: replyContent,
        productId,
        userId: user._id,
        parentId: parentComment._id,
        yourname: user.yourname,
        avatar: user.avatar,
      }).unwrap();

      setLocalComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment._id === parentComment._id) {
            // Sắp xếp các phản hồi theo thời gian tạo giảm dần (createdAt)
            const sortedReplies = [...(comment.replies || []), newReply].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            return {
              ...comment,
              replies: sortedReplies,
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("Lỗi khi thêm phản hồi:", error);
    }
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleGoBack = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="max-width mx-auto bg-gray-200">
      <div className="flex p-4 justify-between items-center">
        <h2 className="text-2xl font-bold">Bình luận sản phẩm</h2>
        <p
          className="hover:text-blue-500 font-bold cursor-pointer"
          onClick={handleCommentClick}
        >
          Bình luận
        </p>
      </div>
      <div className="bg-white p-3 scroll__container">
        {showAddComments && (
          <AddComments
            onClose={handleCloseComments}
            onSubmit={handleAddComment}
            user={user}
          />
        )}
        {isLoading ? (
          <p>Đang tải bình luận...</p>
        ) : isError ? (
          <p>Đã có lỗi xảy ra khi tải bình luận.</p>
        ) : localComments.length === 0 ? (
          <p>Chưa có bình luận nào.</p>
        ) : (
          localComments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
              onReply={handleReplyComment}
            />
          ))
        )}
      </div>
      <div className="text-sm text-black font-semibold p-3 flex justify-between">
        {page > 1 && (
          <p
            className="hover:text-blue-500 cursor-pointer transition"
            onClick={handleGoBack}
          >
            &lt; Quay lại trang trước
          </p>
        )}
        {data?.totalPages > page && (
          <p
            className="hover:text-blue-500 cursor-pointer transition"
            onClick={handleLoadMore}
          >
            Xem thêm bình luận &gt;
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;