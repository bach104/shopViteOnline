import { useState, useMemo, useEffect } from "react";
import { useGetProductsQuery } from "../../redux/features/shop/productsApi";
import StoreBanner from "../../components/StoreBanner";
import ProductCards from "../Shop/review/ProductCards";
import Btn from "../../components/Btn";
import Filter from "../../components/filter/Filter";
import FilterMobile from "../../components/filter/FilterMobile";
const Store = () => {
  const [filters, setFilters] = useState({
    material: new Set(),
    category: new Set(),
    season: new Set(),
    priceRange: { min: "", max: "" },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  const { data, isLoading, error } = useGetProductsQuery({
    page: currentPage,
    limit: productsPerPage,
    material: Array.from(filters.material).join(","),
    category: Array.from(filters.category).join(","),
    season: Array.from(filters.season).join(","),
    minPrice: filters.priceRange.min,
    maxPrice: filters.priceRange.max,
  });

  const allProducts = useMemo(() => data?.products || [], [data]);
  const totalPages = useMemo(() => data?.totalPages || 1, [data]);

  useEffect(() => {
    setCurrentPage(1); 
  }, [filters]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <section className="store__container store__container--mobile relative">
        <StoreBanner />
        <div className="absolute p-3 store__title top-10 left-10 z-10 rounded-md">
          <h4 className="text-5xl text-white">Cửa hàng</h4>
          <p className="text-white mt-3">Hãy lựa chọn theo phong cách của bạn</p>
        </div>
      </section>
      <div className="flex gap-4 p-4 section__container rounded-md">
        <Filter filters={filters} setFilters={setFilters} />
        <div className="flex-1">
          <div className="bg__header flex items-center relative justify-between p-4">
            <h4 className="font-bold">Danh sách sản phẩm</h4>
            <FilterMobile filters={filters} setFilters={setFilters}/>
          </div>
          {isLoading ? (
            <p className="text-center p-4">Đang tải sản phẩm...</p>
          ) : error ? (
            <p className="text-center p-4 text-red-500">
              Không thể tải sản phẩm. Vui lòng thử lại sau.
            </p>
          ) : allProducts.length === 0 ? (
            <p className="text-center p-4 text-gray-500">Không có sản phẩm nào phù hợp.</p>
          ) : (
            <div className="store__list flex flex-col justify-between">
              <div>
                <ProductCards
                  products={allProducts}
                  gridCols="grid grid-cols-2 pt-5 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2 lg:gap-2 md:gap-2" 
                />
              </div>
              <Btn
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Store;