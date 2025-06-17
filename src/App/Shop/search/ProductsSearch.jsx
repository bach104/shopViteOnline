import { useState, useEffect } from "react";
import { useGetProductsQuery } from "../../../redux/features/shop/productsApi";
import ProductCards from "../review/ProductCards";
import Btn from "../../../components/Btn";

const Products = () => {
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { data, error, isLoading } = useGetProductsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  useEffect(() => {
    if (data?.products) {
      if (searchQuery.trim() === "") {
        setFilteredProducts(data.products);
        setIsSearching(false);
      } else {
        const searchTermLower = searchQuery.toLowerCase();
        const filtered = data.products.filter(product => {
          const nameMatch = product.name?.toLowerCase().includes(searchTermLower) || false;
          const seasonMatch = product.season?.toString().toLowerCase().includes(searchTermLower) || false;
          const materialMatch = product.material?.toString().toLowerCase().includes(searchTermLower) || false;
          const categoryMatch = product.category?.name?.toLowerCase().includes(searchTermLower) || false;
          
          return nameMatch || seasonMatch || materialMatch || categoryMatch;
        });
        setFilteredProducts(filtered);
        setIsSearching(true);
      }
    }
  }, [data, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm); 
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const displayProducts = isSearching ? filteredProducts : data?.products || [];
  const totalPages = data?.totalPages || 1;
  return (
    <>
      <div className="p-4 flex  max-width justify-center w-full">
        <input
          id="search-input"
          name="search"
          className="w-5/6 p-3 relative rounded-sm"
          type="text"
          placeholder="Nhập từ khóa cần tìm kiếm (eg. tên, chất liệu, mùa, loại)"
          autoComplete="on"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
        />
        <button
          className="bg-black hover:opacity-80 text-white px-4 py-2 ml-2"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      
      <div className="section__container rounded-md flex-col justify-between">
        <div>
          <h2 className="text-2xl text-center w-full rounded-t-md bg-title-color p-2 mb-3 font-bold">
            {isSearching ? `Sản phẩm đã lọc (${filteredProducts.length} kết quả)` : "Tất cả sản phẩm"}
          </h2>
          {isLoading ? (
            <p className="text-center py-5">Đang tải sản phẩm...</p>
          ) : error ? (
            <p className="text-center py-5 text-red-500">Lỗi: {error.message || "Không thể tải dữ liệu."}</p>
          ) : (
            <>
              {isSearching && (
                <button
                  onClick={handleClearSearch}
                  className="bg-gray-300 px-4 py-2 rounded mb-3"
                >
                  Quay lại danh sách
                </button>
              )}
              <div className="product-list min-h-[500px]">
                {displayProducts.length > 0 ? (
                  <ProductCards products={displayProducts} />
                ) : (
                  <p className="text-center text-gray-500">
                    {isSearching ? "Không tìm thấy sản phẩm phù hợp." : "Không có sản phẩm nào."}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
        
        {(!isSearching || (isSearching && filteredProducts.length > itemsPerPage)) && (
          <div className="pb-5 mx-auto">
            <Btn 
              totalPages={totalPages} 
              currentPage={currentPage} 
              setCurrentPage={handlePageChange} 
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Products;