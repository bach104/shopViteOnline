import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import Home from "../App/Home/Home";
import StoreName from "../App/store/Season";
import Store from "../App/store/Store";
import Products from "../App/Shop/search/ProductsSearch";
import InformationShop from "../App/informationShop/information";
import InformationAuth  from "../App/auth/Information"
import ShowProducts from "../App/Shop/view/showProducts";
import Login from "../components/Login";
import Register from "../components/Register";
import CartManager from "../components/CartNavbar";
import ShoppingCart from "../App/cart/ShoppingCart/ShoppingCart";
import Confirmation from "../App/cart/confirmation/Confirmation";
import Delivery from "../App/cart/delivery/Delivery";
import Delivered from "../App/cart/delivered/Delivered";
import AdminManager from "../App/auth/managerAdmin/AdminManager";
import ManagerProducts from "../App/managerAdmin/products/managerProducts";
import ManagerAuths from "../App/managerAdmin/auth/managerAuths";
import ManagerCart from "../App/managerAdmin/cart/managerCart";
import ManagerTransport from "../App/managerAdmin/transport/managerTransport";
import ManagerStatistical from "../App/managerAdmin/statistical/managerStatistical";
import InformationProducts from "../App/managerAdmin/products/informationProducts";
import VnpayReturnHandler from "../App/cart/ShoppingCart/VnpayReturnHandler";
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
            path: "/informations",
            element: <InformationAuth />,
        },
        
       
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "payment/vnpay-return",
        element: <VnpayReturnHandler />,
    },
    {
    path: "/cart-manager",
    element: <CartManager />, 
    children: [
      { path: "", element: <ShoppingCart /> }, 
      { path: "confirmation", element: <Confirmation /> },
      { path: "delivery", element: <Delivery /> },
      { path: "delivered", element: <Delivered /> },
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
            {path:"managerAuths", element:<ManagerAuths/>},
            {path:"managerCart", element:<ManagerCart/>},
            {path:"managerTransport", element:<ManagerTransport/>},
            {path:"managerStatistical", element:<ManagerStatistical/>},
        ]
    }
]);
export default router;