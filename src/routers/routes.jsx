import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import Home from "../App/Home/Home";
import StoreName from "../App/store/Season";
import Store from "../App/store/Store";
import Products from "../App/Shop/search/ProductsSearch";
import InformationShop from "../App/informationShop/information";
import InformationAuth  from "../App/informationAuth/Information"
import ShowProducts from "../App/Shop/viewInformationsProduct/showProducts";
import Login from "../components/Login";
import Register from "../components/Register";
import CartManager from "../components/CartNavbar";
import ShoppingCart from "../App/cart/ShoppingCart/ShoppingCart";
import Confirmation from "../App/cart/Confirmation";
import OnDelivery from "../App/cart/onDelivered";
import Delivery from "../App/cart/Delivery";
import Delivered from "../App/cart/orderSucsses";
import AdminManager from "../components/manager/navabar";
import ManagerProducts from "../App/manager/products/managerProducts";
import ManagerBillOrder from "../App/manager/managerOrderBill";
import ManagerAuths from "../App/manager/managerAuths";
import ManagerOrderConfirmnit from "../App/manager/managerOrder";
import ManagerStatistical from "../App/manager/StatisticalDashboard/managerStatistical";
import InformationProducts from "../App/manager/products/informationProducts";
import VnpayReturnHandler from "../App/cart/ShoppingCart/VnpayReturnHandler";
import SmsAdmin from "../App/message/messageAdmin"
import SmsUser from "../App/message/messageUse"
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element:<Home/>
        },
        { 
            path: "/store/:seasonName",
            element: <StoreName />,
        },
        {
            path: "/store",
            element: <Store />,
        },
        {
            path: "/store",
            element: <Store />,
        },
        {
            path: "/products",
            element: <Products />,
        },
        {
            path: "/products/:id",
            element: <ShowProducts/>,
        },
        {
            path: "/introduce",
            element: <InformationShop />,
        },
        {
            path: "/thong_tin_ca_nhan",
            element: <InformationAuth />,
        },
        ],
    },
    {
        path: "/dang_nhap",
        element: <Login />,
    },
    {
        path: "/dang_ky",
        element: <Register />,
    },
    {
        path: "payment/vnpay-return",
        element: <VnpayReturnHandler />,
    },
    {
        path:"/tat_ca_tin_nhan",
        element:<SmsAdmin/>
    },
    {
        path:"/tin_nhan",
        element:<SmsUser/>
    },
    {
    path: "/cart-manager",
    element: <CartManager />, 
    children: [
      { path: "", element: <ShoppingCart /> }, 
      { path: "confirmation", element: <Confirmation /> },
      { path: "delivery", element: <Delivery /> },
      { path: "delivered", element: <Delivered /> },
      { path: "onDelivery", element: <OnDelivery /> },
    ],
    },
    {
        path:"/admin-manager",
        element:<AdminManager/>,
        children:[
            {
                path:"", 
                element:<ManagerProducts/>,
                children:[
                    {
                        path: "products/:id",
                        element: <InformationProducts/>,
                    },
                ]
            },
            {path:"quan_ly_khach_hang", element:<ManagerAuths/>},
            {path:"quan_ly_don_hang", element:<ManagerOrderConfirmnit/>},
            {path:"quan_ly_hoa_don", element:<ManagerBillOrder/>},
            {path:"thong_ke", element:<ManagerStatistical/>},

        ]
    }
])
export default router;