import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, Outlet } from "react-router"
import Footer from "./footer"
const CartManager = () => {
  return (
    <>
    <div className=" w-full border-b-2">
      <header className="cartManager">
        <div className="bg-black opacity-80">
          <div className="relative container-width">
            <Link to="/" className="absolute text-white transition hover:opacity-80 btn-comeBack">
              <FontAwesomeIcon icon={faHouse} />
            </Link>
            <h2 className="text-center text-white p-2 text-2xl font-bold">Giỏ hàng của bạn</h2>
          </div>
        </div>
      <ul className="cartNavbar container-width flex justify-evenly ">
        <li className="w-full btn__li text-center">
          <Link className="w-full block p-2">Giỏ hàng</Link>
        </li>
        <li className="w-full btn__li text-center">
          <Link to="confirmation" className="w-full block p-2">Chờ xác nhận</Link>
        </li>
        <li className="w-full btn__li text-center">
          <Link to="delivery" className="w-full block p-2">Chờ giao hàng</Link>
        </li>
        <li className="w-full btn__li text-center">
          <Link to="onDelivery" className="w-full block p-2">Đang giao</Link>
        </li>
        <li className="w-full btn__li text-center">
          <Link to="delivered" className="w-full block p-2">Các đơn hàng đã nhận</Link>
        </li>
      </ul>
    </header>
    </div>
      <Outlet />
      <Footer/>
    </>
  )
}
export default CartManager

