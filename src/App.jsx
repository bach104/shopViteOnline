import { Outlet } from "react-router";
import Navbar from "./components/navbar/Navbar";
import Footer from './components/footer'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./sass/index.scss";
import './App.css';
export default function App() {
  return (
    <div>
      <ToastContainer />
      <Navbar/>
      <Outlet />
      <Footer/>
    </div>
  );
}
