import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../redux/features/auth/authSlice";

const Messenger = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = JSON.parse(localStorage.getItem('user'));
  const messagePath = user?.role === 'admin' ? '/tat_ca_tin_nhan' : '/tin_nhan';

  const handleClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert('Vui lòng đăng nhập để sử dụng tính năng nhắn tin');
    }
  };

  return (
    <Link 
      className="text-black hover:opacity-50 items-center space-x-4" 
      to={messagePath}
      onClick={handleClick}
    >
      <i className="fa-regular text-xl fa-comment-dots"></i>
    </Link>
  )
}
export default Messenger;