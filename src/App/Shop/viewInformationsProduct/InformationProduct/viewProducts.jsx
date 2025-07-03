import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../../../redux/features/shop/productsApi";
import { toast } from "react-toastify";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAddToCartMutation } from "../../../../redux/features/cart/cartApi";
import { selectAllCartItems } from "../../../../redux/features/cart/cartSlice";
import { getBaseUrl } from "../../../../utils/baseURL";
import ProductMediaGallery from "./ProductMediaGallery";
import ProductInfo from "./ProductInfo";

const ViewProducts = () => {
  const { id } = useParams();
  const [addToCart] = useAddToCartMutation();
  const cartItems = useSelector(selectAllCartItems);
  const { user } = useSelector((state) => state.auth); 
  const [cachedProduct, setCachedProduct] = useState(null);
  const { data, refetch, isLoading, isError } = useGetProductByIdQuery(id, { skip: !id });
  
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  useEffect(() => {
    if (data?.product) {
      setCachedProduct(data.product);
    }
  }, [data]);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const product = cachedProduct || data?.product;
  const scrollRef = useRef(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.size?.[0] || null);
      setSelectedColor(product.color?.[0] || null);
    }
  }, [product]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 150, behavior: "smooth" });
    }
  };

  const addToCartHandler = async () => {
    if (!user) {
      toast.warning("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return; 
    }
    if (!product) {
      toast.error("Không thể thêm sản phẩm không tồn tại vào giỏ hàng!");
      return;
    }
    if (!selectedSize || !selectedColor) {
      toast.warning("Vui lòng chọn size và màu sắc trước khi thêm vào giỏ hàng!");
      return;
    }
    const existingItem = cartItems.find(
      (item) =>
        item.productId === product._id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );
    if (existingItem) {
      toast.info("Sản phẩm với size và màu sắc này đã có trong giỏ hàng!");
    } else {
      try {
        const cartData = {
          productId: product._id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        };
        await addToCart(cartData).unwrap();
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
      } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        toast.error("Bạn cần đăng nhập lại");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !product) {
    return <div>Không tìm thấy sản phẩm hoặc có lỗi xảy ra</div>;
  }

  const imageUrl = product.images?.[0]
    ? `${getBaseUrl()}/${product.images[0].replace(/\\/g, "/")}`
    : null;
  const videoUrl = product.video?.[0]
    ? `${getBaseUrl()}/${product.video[0].replace(/\\/g, "/")}`
    : null;

  return (
    <div className="grid InformationProducts max-width">
      <h2 className="text-2xl text-center w-full font-bold bg__div p-4">
        Thông tin sản phẩm
      </h2>
      <div className="p-4 InformationContainer gap-0 grid grid-cols-4 md:gap-3  ">
        <ProductMediaGallery 
          product={product}
          videoUrl={videoUrl}
          imageUrl={imageUrl}
          scrollRef={scrollRef}
          handleScroll={handleScroll}
        />
        <ProductInfo 
          product={product}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          quantity={quantity}
          setQuantity={setQuantity}
          addToCartHandler={addToCartHandler}
        />
      </div>
    </div>
  );
};

export default ViewProducts;