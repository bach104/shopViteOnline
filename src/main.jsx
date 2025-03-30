import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import './index.css'
import router from "./routers/routes";
import 'remixicon/fonts/remixicon.css'
const root = document.getElementById("root");
import { Provider } from 'react-redux'
import store from "./redux/store";
ReactDOM.createRoot(root).render(
  <Provider store={store}>
     <RouterProvider router={router} />
  </Provider>
);