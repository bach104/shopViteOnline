import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

const Messager = () => {
  const user = useSelector(selectCurrentUser);
  
  const messageLink = user?.role === 'admin' 
    ? "/tat_ca_tin_nhan" 
    : "/tin_nhan";

  return (
    <div>
      <Link 
        to={messageLink} 
        className="hover:text-gray-400 transition"
      >
        <i className="fa-regular fa-comment-dots text-xl w-5 h-5 cursor-pointer"></i>
      </Link>
    </div>
  )
}

export default Messager;