import PropTypes from "prop-types";
import avatarImg from "../../../assets/img/avatar.png";
import { getBaseUrl } from "../../../utils/baseURL";

const OrderItem = ({ item }) => {
  const getProductImage = (image) => {
    if (!image) return avatarImg;
    return `${getBaseUrl()}/${image.replace(/\\/g, "/")}`;
  };

  return (
    <div className="flex shoppingItems gap-2 h-32 bg__select p-2 rounded-sm shadow-sm">
      <img 
        src={getProductImage(item.image)} 
        className="w-28 border border-black h-full object-cover rounded-s" 
        alt={item.name || 'Product image'}
        onError={(e) => (e.target.src = avatarImg)}
      />
      <div className="flex-1 shoppingItems__technology">
        <h3 className="font-medium">{item.name || 'Sản phẩm'}</h3>
        <p className="text-sm">
          <b>Giá:</b> {((item.price || 0) * (item.quantity || 0)).toLocaleString()}đ
        </p>
        <p className="text-sm">
          <b>Số lượng:</b> {item.quantity || 0}
        </p>
        <p className="text-sm">
          <b>Size:</b> {item.size || 'N/A'} | <b>Màu:</b> {item.color || 'N/A'}
        </p>
      </div>
      <div className="h-full flex items-end">
        <button className="btn__click2">Đánh giá</button>
      </div>
    </div>
  );
};

OrderItem.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    quantity: PropTypes.number,
    size: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
};

export default OrderItem;