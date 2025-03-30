import PropTypes from "prop-types";

const Btn = ({ totalPages, currentPage, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  const visiblePages = 4;
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center mt-5">
      <button
        className={`w-10 h-10 flex justify-center items-center btn__click rounded-sm mx-3 ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        <i className="fa-solid fa-angle-left"></i>
      </button>

      {startPage > 1 && (
        <span className="w-10 h-10 flex justify-center items-center btn__click rounded-sm mx-1">...</span>
      )}

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`w-10 h-10 flex justify-center items-center btn__click rounded-sm mx-1 ${
            currentPage === pageNumber ? "bg-gray-700 text-white" : "cursor-pointer"
          }`}
          onClick={() => setCurrentPage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      {endPage < totalPages && (
        <span className="w-10 h-10 flex justify-center items-center btn__click rounded-sm mx-1 ">...</span>
      )}

      <button
        className={`w-10 h-10 flex justify-center items-center btn__click rounded-sm mx-3 ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        <i className="fa-solid fa-angle-right"></i>
      </button>
    </div>
  );
};

Btn.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default Btn;
