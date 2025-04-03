import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setCredentials } from "../../redux/features/auth/authSlice"; // Thay setUser bằng setCredentials
import { resetCart } from "../../redux/features/cart/cartSlice";
import avatarImg from "../../assets/img/avatar.png";
import { getBaseUrl } from "../../utils/baseURL";

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser && storedToken) {
        try {
          // Sử dụng setCredentials thay vì setUser
          dispatch(setCredentials({ 
            user: JSON.parse(storedUser), 
            token: storedToken 
          }));
        } catch (error) {
          console.error("Error parsing user from localStorage", error);
        }
      }
    }
  }, [user, dispatch]);

  const avatarUrl = user?.avatar
    ? `${getBaseUrl()}/${user.avatar.replace(/\\/g, "/")}`
    : avatarImg;

  const handleDropdownToggle = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const adminDropDownMenus = [
    { label: "Quản lý mục", path: "/admin-manager" },
    { label: "Tất cả đơn hàng", path: "/admin-manager/managerOrderConfirmnit" },
    { label: "Thông tin cá nhân", path: "/informations" },
  ];    
  const userDropDownMenus = [
    { label: "Thông tin cá nhân", path: "/informations" },
    { label: "Giỏ hàng của bạn", path: "/cart-manager" },
  ];
  const dropDownMenus = user?.role === "admin" ? adminDropDownMenus : userDropDownMenus;

  return (
    <>
      {user ? (
        <>
          <img
            onClick={handleDropdownToggle}
            className="size-7 rounded-full cursor-pointer"
            src={avatarUrl} 
            onError={(e) => (e.target.src = avatarImg)}
            alt="Avatar"
          />
          {isDropDownOpen && (
            <div className="absolute w-48 border-black border-y border-x top-10 right-0 bg-white p-2 rounded-lg shadow-lg z-50">
              <ul className="font-medium">
                {dropDownMenus.map((menu, index) => (
                  <li key={index} className="border-b-2">
                    <Link
                      onClick={() => setIsDropDownOpen(false)}
                      className="dropdown-items px-2 hover:bg-gray-200 py-3 block"
                      to={menu.path}
                    >
                      {menu.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    className="dropdown-items px-2 hover:bg-gray-200 py-3 w-full text-left"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <Link to="/login">
          <User className="w-5 h-5 cursor-pointer" />
        </Link>
      )}
    </>
  );
};

export default Auth;