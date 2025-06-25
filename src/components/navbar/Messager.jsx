import { useState } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated } from "../../redux/features/auth/authSlice";

const Messager = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const messageLink = user?.role === 'admin' 
    ? "/tat_ca_tin_nhan" 
    : "/tin_nhan";

  const handleClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
  };

  return (
    <div className="relative">
      <Link 
        to={messageLink} 
        className="hover:text-gray-400 transition"
        onClick={handleClick}
      >
        <i className="fa-regular fa-comment-dots text-xl w-5 h-5 cursor-pointer"></i>
      </Link>
      
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
          Vui lòng đăng nhập để truy cập tin nhắn
        </div>
      )}
    </div>
  )
}

export default Messager;