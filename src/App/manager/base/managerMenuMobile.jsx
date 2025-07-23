import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faBars,
  faShop,
  faUsers,
  faFile,
  faChartLine,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
const ManagerMenuMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="manager__Mobile">
      <nav 
        className="cursor-pointer text-2xl"
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={faBars} />
      </nav>
      <ul 
        className={`managerMobile ${isMenuOpen ? "open" : ""}`}
      >
        <div className="flex p-4 items-center gap-2 border-b-2 border-gray-400">
          <FontAwesomeIcon 
            icon={faBars} 
            className="text-black text-2xl cursor-pointer" 
            onClick={closeMenu}
          />
          <h2 className="text-black text-2xl">Quản lý sản phẩm</h2>
        </div>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2 text-gray-500" to="/admin-manager">
            <FontAwesomeIcon className="w-7" icon={faShop} />
            Quản lý sản phẩm
          </Link>
        </li>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2 text-gray-500" to="/admin-manager/quan_ly_khach_hang">
            <FontAwesomeIcon className="w-7" icon={faUsers} />
            Quản lý khách hàng
          </Link>
        </li>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2 text-gray-500" to="/admin-manager/quan_ly_don_hang">
            <FontAwesomeIcon className="w-7" icon={faFile} />
            Quản lý đơn hàng
          </Link>
        </li>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2 text-gray-500" to="/admin-manager/quan_ly_hoa_don">
            <FontAwesomeIcon className="w-7" icon={faFile} />
            Quản lý hoá đơn
          </Link>
        </li>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2 text-gray-500" to="/admin-manager/thong_ke">
            <FontAwesomeIcon className="w-7" icon={faChartLine} />
            Thống kê
          </Link>
        </li>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2 text-gray-500" to="/">
            <FontAwesomeIcon icon={faHouse} className="w-7"/>
            Trang chủ
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ManagerMenuMobile;