import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { faBars, faHouse, faShop, faShirt, faBook } from "@fortawesome/free-solid-svg-icons"

const NavbarMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative navbarMobile__menu">
      <nav 
        className="cursor-pointer text-2xl"
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={faBars} />
      </nav>
      
      <ul 
        className={`absolute navbarMobile__list bg-white left-0 top-0 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
        }`}
      >
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2" to="/">
            <FontAwesomeIcon className="w-7" icon={faHouse} />
            Trang chủ
          </Link>
        </li>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2" to="/store">
            <FontAwesomeIcon className="w-7" icon={faShop} />
            Cửa hàng
          </Link>
        </li>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2" to="/products">
            <FontAwesomeIcon className="w-7" icon={faShirt} />
            Sản phẩm
          </Link>
        </li>
        <li className="flex items-center" onClick={closeMenu}>
          <Link className="p-3 flex w-full items-center gap-2" to="/introduce">
            <FontAwesomeIcon className="w-7" icon={faBook} />
            Giới thiệu
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default NavbarMobile;