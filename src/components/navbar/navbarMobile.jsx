import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { faBars } from "@fortawesome/free-solid-svg-icons"
const navbarMobile = () => {
  return (
    <div className="relative navbarMobile__menu">
        <nav className="cursor-pointer text-2xl">
            <FontAwesomeIcon icon={faBars} />
        </nav>
        <ul className="absolute navbarMobile__list bg-white left-0 top:0">
            <li>
                <Link to="/">Trang chủ</Link>
            </li>
            <li>
                <Link to="">Cửa hàng</Link>
            </li>
            <li>
                <Link to="">Sản phẩm</Link>
            </li>
            <li>
                <Link to="">Giới thiệu</Link>
            </li>
        </ul>
    </div>
  )
}

export default navbarMobile
