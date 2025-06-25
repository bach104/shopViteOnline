
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPrevPage, 
  onNextPage,
  searchTerm,
  className = "flex bg-black bg-opacity-70 justify-between p-2 gap-2"
}) => {
  if (totalPages <= 1 || searchTerm) return null;

  return (
    <div className={className}>
      <button
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className={`bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Trang trước
      </button>
      <span className="flex items-center text-white">
        Trang {currentPage}/{totalPages}
      </span>
      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className={`bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Trang kế tiếp
      </button>
    </div>
  );
};

export default Pagination;