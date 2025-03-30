import { useSelector } from "react-redux";
import { useAddToCartMutation, useFetchCartQuery } from "../../../redux/features/cart/cartApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { cartApi } from "../../../redux/features/cart/cartApi";
import "react-toastify/dist/ReactToastify.css";

const AddToCart = ({ productId, setCartCount }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { data: cartData = { cartItems: [] } } = useFetchCartQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });

  const cartItems = cartData.cartItems;
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleAddToCart = async () => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", { autoClose: 500, position: "top-right" });
      return;
    }
    if (cartItems.some((item) => item.productId === productId)) {
      toast.info("Sản phẩm đã có trong giỏ hàng!", { autoClose: 500, position: "top-right" });
      return;
    }
    try {
      const response = await addToCart({ productId, quantity: 1 }).unwrap();
      toast.success(response?.message || "Sản phẩm đã được thêm vào giỏ hàng!", { autoClose: 500, position: "top-right" });
      dispatch(
        cartApi.util.updateQueryData("fetchCart", undefined, (draft) => {
          if (!draft) {
            draft = { cartItems: [] };
          }
          if (draft.cartItems) {
            draft.cartItems.push({ productId, quantity: 1 });
          }
        })
      );
      if (setCartCount) {
        setCartCount((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Lỗi khi thêm vào giỏ hàng!", { autoClose: 1000, position: "top-right" });
    }
  };

  return (
    <button className="absolute right-3 top-3" onClick={handleAddToCart} disabled={isLoading}>
      <i className="fa-solid text-xl transition text-white fa-cart-shopping bg-black opacity-60 w-10 h-10 btn__add flex justify-center"></i>
    </button>
  );
};

export default AddToCart;