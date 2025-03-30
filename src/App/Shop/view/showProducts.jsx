import ViewProducts from "./viewProducts";
import SuggestedProducts from "./SuggestedProducts";
import Comments from "./Comments";
import { useParams } from "react-router-dom";

const ShowProducts = () => {
  const { id } = useParams(); 

  return (
    <div>
      <ViewProducts />
      <Comments productId={id} />
      <SuggestedProducts />
    </div>
  );
};

export default ShowProducts;