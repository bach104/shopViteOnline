import { getBaseUrl } from "../../../utils/baseURL";
import avatarImg from "../../../assets/img/avatar.png";

const InformationAuth = ({ user, onBack }) => {
  const getAvatarUrl = () => {
    if (user.avatar) {
      return `${getBaseUrl()}/${user.avatar.replace(/\\/g, "/")}`;
    }
    return avatarImg;
  };

  return (
    <>
      <div className="Manager__display--Title flex justify-between">
        <h2 className="text-xl p-4">Thông tin khách hàng</h2>
      </div>
      <div className="Manager__display--Box p-4 ">
        <div className="flex gap-6">
          <img 
            src={getAvatarUrl()} 
            alt="Avatar" 
            className="w-96 h-96 object-cover border border-black rounded-s"
          />
          <div className="flex flex-col gap-2">
            <p><b>Tên tài khoản:</b> {user.username}</p>
            <p><b>Họ tên:</b> {user.yourname || "Chưa cập nhật"}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>SĐT:</b> {user.phoneNumber || "Chưa cập nhật"}</p>
            <p><b>Địa chỉ:</b> {user.address || "Chưa cập nhật"}</p>
          </div>
        </div>
      </div>
      <div className="flex bg-black opacity-80 justify-end p-2">
        <button 
          onClick={onBack}
          className="bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black"
        >
          Quay lại danh sách
        </button>
      </div>
    </>
  );
};

export default InformationAuth;