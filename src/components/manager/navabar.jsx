import { faFile,faChartLine, faHouse, faShop, faUsers} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link, Outlet } from "react-router"
const AdminManager = () => {
  return (
    <div>
        <header className="headerAdmin">
            <div className="bg-black opacity-80">
            <div className="items-center px-4 flex container-width">
                <Link to="/" className=" text-white flex mt-4 w-10 h-full items-center transition hover:opacity-80 btn-comeBack">
                <FontAwesomeIcon icon={faHouse} />
                </Link>
            </div>
            </div>
        </header>
        <div className="introduce__grid Manager__admin flex gap-4 bg-slate-100 grid-4 p-4">
            <div className="Manager__item">
                <h2 className="text-xl">Danh mục</h2>
                <ul>
                    <li>
                        <Link to="" className="p-4 flex items-center gap-2">
                        <FontAwesomeIcon className="w-4"  icon={faShop} />
                            Quản lý sản phẩm
                        </Link>
                    </li>
                    <li>
                        <Link to="quan_ly_khach_hang" className="p-4 flex items-center gap-2 ">
                        <FontAwesomeIcon className="w-4"  icon={faUsers} />
                            Quản lý khách hàng
                        </Link>
                    </li>
                    <li>
                        <Link to="quan_ly_don_hang" className="p-4 flex items-center gap-2 ">
                        <FontAwesomeIcon className="w-4"  icon={faFile} />
                            Quản lý đơn hàng
                        </Link>
                    </li>
                    <li>
                        <Link to="quan_ly_hoa_don" className="p-4 flex items-center gap-2 ">
                        <FontAwesomeIcon className="w-4"  icon={faFile} />
                            Quản lý hoá đơn
                        </Link>
                    </li>
                    <li>
                        <Link to="thong_ke" className="p-4 flex items-center gap-2 ">
                        <FontAwesomeIcon className="w-4"  icon={faChartLine} />
                        Thống kê
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="Manager__display border border-black w-full">
                <Outlet/>
            </div>
        </div>
    </div>
  )
}
export default AdminManager
