import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ViewProducts from "./InformationProduct/viewProducts";
import SuggestedProducts from "./SuggestedProducts";
import Comments from "./comment/Comments";

const ShowProducts = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const shouldShowReview = sessionStorage.getItem('shouldShowReviewButton') === 'true';
    const reviewProductId = sessionStorage.getItem('reviewProductId');

    if (shouldShowReview && reviewProductId === id) {
      navigate(location.pathname, { 
        state: { fromOrder: true }, 
        replace: true 
      });
    }

    return () => {
      sessionStorage.removeItem('shouldShowReviewButton');
      sessionStorage.removeItem('reviewProductId');
    };
  }, [id, location.pathname, navigate]);
  return (
    <div>
      <ViewProducts />
      <Comments 
        productId={id} 
        fromOrder={location.state?.fromOrder || false} 
      />
      <SuggestedProducts />
    </div>
  );
};

export default ShowProducts;