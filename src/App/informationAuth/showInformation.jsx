
import { useSelector } from "react-redux";
import avatarImg from "../../assets/img/avatar.png";
import { getBaseUrl } from "../../utils/baseURL";
import { useEffect, useState } from "react";
const ShowInformation = () => {
  const user = useSelector((state) => state.auth?.user);

  const [userInfo, setUserInfo] = useState(user);

  useEffect(() => {
    setUserInfo(user);
  }, [user]);

  if (!userInfo) {
    return <div>Loading...</div>; 
  }

  const { avatar, yourname, address, phoneNumber, email, role } = userInfo;
  const avatarUrl = avatar ? `${getBaseUrl()}/${avatar.replace(/\\/g, "/")}` : avatarImg;

  return (
    <>
      <div className="bg-gray-200 boxContainer p-4 text-center font-bold">
        <h2>Thông tin cá nhân</h2>
      </div>
      <div className="mt-5 boxContainer inforMobile">
        <div className="mt-4  grid grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col items-center bg-gray-200 col-span-2">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-56 mt-4 h-56 flex items-center justify-center rounded-full"
            />
            <p className="mt-2">{yourname || "Tên của bạn"}</p>
          </div>
          <div className="col-span-2">
            <p><strong>{role === "admin" ? "Tên shop" : "Họ và tên"}:</strong> {yourname || "Xin cập nhật"}</p>
            <p><strong>Địa chỉ:</strong> {address || "Xin cập nhật"}</p>
            <p><strong>Số điện thoại:</strong> {phoneNumber || "Xin cập nhật"}</p>
            <p><strong>Email:</strong> {email || "Xin cập nhật"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowInformation;
