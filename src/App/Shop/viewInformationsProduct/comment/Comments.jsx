import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
} from "../../../../redux/features/comment/commentApi";
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

  useEffect(() => {
    if (!isLoading && !isError && data?.comments) {
      const sortedComments = [...data.comments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLocalComments(sortedComments);
    }
  }, [data, isLoading, isError]);

  const handleCommentClick = () => {
    if (!user) {
      alert("Bạn cần đăng nhập để đánh giá!");
      return;
    }
    setShowAddComments((prev) => !prev);
  };

  const handleCloseComments = () => {
    setShowAddComments(false);
  };

  const handleAddComment = async (comment) => {
    if (!user) {
      alert("Bạn cần đăng nhập để đánh giá!");
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
      setLocalComments((prevComments) => {
        const updatedComments = [commentWithId, ...prevComments];
        if (page === 1) {
          return updatedComments;
        }
        return updatedComments;
      });
      setShowAddComments(false);
      if (page !== 1) {
        alert("đánh giá mới đã được thêm. Vui lòng quay lại trang 1 để xem.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm đánh giá:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId).unwrap();
      setLocalComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Lỗi khi xoá đánh giá:", error);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    if (!commentId || !newContent.trim()) {
      console.error("ID đánh giá hoặc nội dung không hợp lệ!");
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
      console.error("Lỗi khi sửa đánh giá:", error);
    }
  };

  const handleReplyComment = async (parentId, content) => {
    if (!user) {
      alert("Bạn cần đăng nhập để trả lời đánh giá!");
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
    <div className="container-width mx-auto bg-gray-200">
      <div className="flex p-4 justify-between items-center">
        <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>
        <p
          className="hover:text-blue-500 font-bold cursor-pointer"
          onClick={handleCommentClick}
        >
          Đánh giá
        </p>
      </div>
      <div className="bg-white p-3 scroll__container">
        {showAddComments && (
          <AddComments
            onClose={handleCloseComments}
            onSubmit={handleAddComment}
            user={user}
            productId={productId}
          />
        )}
        {isLoading ? (
          <p>Đang tải đánh giá...</p>
        ) : isError ? (
          <p>Đã có lỗi xảy ra khi tải đánh giá.</p>
        ) : localComments.length === 0 ? (
          <p>Chưa có đánh giá nào.</p>
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
            Xem thêm đánh giá &gt;
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;