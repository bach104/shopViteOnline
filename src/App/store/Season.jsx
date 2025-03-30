import { useState, useCallback } from "react";
import { useParams } from "react-router";
import { useGetProductsBySeasonQuery } from "../../redux/features/shop/productsApi";
import ProductCards from "../Shop/review/ProductCards";
import StoreBanner from "../../components/StoreBanner";
import Btn from "../../components/Btn";

const StoreName = () => {
  const { seasonName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;
  const { data, isLoading, isError } = useGetProductsBySeasonQuery({
    season: seasonName,
    page: currentPage,
    limit: productsPerPage,
  });
  const products = data?.products || [];
  const totalProducts = data?.totalProducts || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  if (isLoading) return <div>Đang tải sản phẩm...</div>;
  if (isError) return <div>Đã xảy ra lỗi khi tải sản phẩm.</div>;
  if (!products.length) return <div>Không có sản phẩm nào cho mùa này.</div>;

  return (
    <>
      <section className="store__container relative">
        <StoreBanner />
        <div className="absolute p-3 store__title top-10 left-10 z-10 rounded-md">
          <h4 className="text-5xl text-white">
            Thời trang mùa <span>{seasonName}</span>
          </h4>
          <p className="text-white mt-3">Hãy lựa chọn theo phong cách của bạn</p>
        </div>
      </section>

      <div className="section__container flex-col justify-between">
        <div>
          <ProductCards products={products} />
        </div>
        {totalPages > 1 && (
          <div className="mt-5 pb-10">
            <Btn totalPages={totalPages} currentPage={currentPage} setCurrentPage={handlePageChange} />
          </div>
        )}
      </div>
    </>
  );
};

export default StoreName;
