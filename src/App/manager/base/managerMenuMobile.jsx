import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { faBars,faShop,faUsers,faFile,faChartLine, } from "@fortawesome/free-solid-svg-icons"
const NavbarMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="menuManagerMobile navbarMobile__menu">
      <nav 
        className="cursor-pointer text-2xl"
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={faBars} />
      </nav>
      <ul 
        className={`navbarMobile__list navbarMobile__list--manager ${
          isMenuOpen ? 'opened' : ''
        }`}
      >
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2 text-black" to="/admin-manager">
            <FontAwesomeIcon className="w-7" icon={faShop} />
            Quản lý sản phẩm
          </Link>
        </li>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2 text-black" to="/admin-manager/quan_ly_khach_hang">
            <FontAwesomeIcon className="w-7" icon={faUsers} />
            Quản lý khách hàng
          </Link>
        </li>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2 text-black" to="/admin-manager/quan_ly_don_hang">
            <FontAwesomeIcon className="w-7" icon={faFile} />
            Quản lý đơn hàng
          </Link>
        </li>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2 text-black" to="/admin-manager/quan_ly_hoa_don">
            <FontAwesomeIcon className="w-7" icon={faFile} />
            Quản lý hoá đơn
          </Link>
        </li>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2 text-black" to="/admin-manager/thong_ke">
            <FontAwesomeIcon className="w-7" icon={faChartLine} />
             Thống kê
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default NavbarMobile;