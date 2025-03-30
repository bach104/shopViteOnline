import { useNavigate } from "react-router-dom";
import { useGetRandomProductsQuery } from "../../../redux/features/shop/productsApi";
import ProductCards from "../review/ProductCards";

const SuggestedProducts = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetRandomProductsQuery();

  const handleProductClick = (productId) => {
    navigate(`/review-products/${productId}`); 
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container-width">
      <h2 className="text-2xl w-full font-bold bg__div p-4">Sản phẩm gợi ý</h2>
      <div className="products__wrapper">
        <ProductCards
          products={data?.products || []}
          onProductClick={handleProductClick}
        />
      </div>
    </div>
  );
};

export default SuggestedProducts;