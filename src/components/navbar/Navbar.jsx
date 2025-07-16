import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import Shoppingcart from "./Shoppingcart";
import MessagerIcons from "./Messager";
import Auth from "./Auth";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import NavbarMobile from "./navbarMobile"
const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const isAdmin = user?.role === 'admin';
  return (
    <header className="header z-20 bg-white">
      <nav className="max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <nav className="navbarMobile">
            <NavbarMobile/>
          </nav>
          <nav className="nav__logo">
            <Link className="transition" to="/">
              ShopVite
            </Link>
          </nav>
        </div>
        <ul className="nav__links md:flex-none">
          <li>
            <Link className="hover:text-gray-400 transition" to="/">
              Trang chủ
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-400 transition" to="/store">
              Cửa hàng
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-400 transition" to="/products">
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link className="hover:text-gray-400 transition" to="/introduce">
              Giới thiệu
            </Link>
          </li>
        </ul>
        <div className="flex items-center space-x-4">
          <span>
            <Link className="hover:text-gray-400 transition" to="/products">
              <Search className="w-5 h-5 cursor-pointer" />
            </Link>
          </span>
          <span>
            <MessagerIcons/>
          </span>
          {!isAdmin && (
            <span className="relative">
              <Shoppingcart />
            </span>
          )}
          <span className="relative">
            <Auth />
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;