import { Link } from "react-router-dom";
import ProductCards from "./ProductCards";
import { useGetTopFeaturedProductsQuery } from "../../../redux/features/shop/productsApi";

const FeaturedProducts = () => {
  const { data, error, isLoading } = useGetTopFeaturedProductsQuery();

  return (
    <section className="introduce__grid">
      <h2 className="section__header p-4 bg__header">Sản phẩm nổi bật</h2>
      {isLoading ? (
        <p className="text-center py-5">Đang tải sản phẩm...</p>
      ) : error ? (
        <p className="text-center py-5 text-red-500">Lỗi: {error.message || "Không thể tải dữ liệu."}</p>
      ) : (
        <>
          <div className="products__wrapper">
            <ProductCards products={data?.products || []} />
          </div>
          <div className="mt-5 pb-10">
            <Link to="/store" className="btn__seemore hover:opacity-90 m-auto text-center block w-56 transition text-white">
              Xem thêm sản phẩm
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedProducts;
