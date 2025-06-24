import { useState } from 'react';
import { useUpdateUserMutation } from '../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../redux/features/auth/authSlice'; // Thay setUser bằng updateUserInfo
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const UpdateInformation = () => {
  const [userData, setUserData] = useState({
    yourname: '',
    address: '',
    phoneNumber: '',
    email: '',
    avatar: null,
  });
  const [emailError, setEmailError] = useState(''); 
  const [phoneNumberError, setPhoneNumberError] = useState(''); 
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    if (name === 'email') {
      setEmailError('');
    }
    if (name === 'phoneNumber') {
      setPhoneNumberError('');
    }
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setUserData({ ...userData, avatar: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneNumberRegex = /^[0-9]{10}$/; 
    if (userData.phoneNumber && !phoneNumberRegex.test(userData.phoneNumber)) {
      setPhoneNumberError('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại gồm 10 chữ số.');
      return;
    }

    try {
      const response = await updateUser({ userData }).unwrap();
      
      if (response.emailExists) {
        setEmailError('Email đã được sử dụng. Vui lòng chọn email khác.');
        return;
      }
      
      const updatedUser = { ...JSON.parse(localStorage.getItem('user')), ...response.user };

      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Sử dụng updateUserInfo thay vì setUser
      dispatch(updateUserInfo({ 
        user: updatedUser, 
        token: response.token || localStorage.getItem('token') 
      }));

      toast.success('Cập nhật thông tin thành công!', { position: 'top-center' });
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin.', { position: 'top-center' });
    }
  };

  return (
    <div className="boxContainer pb-10">
      <form className="space-y-4 p-5 bg-gray-200 mt-4" onSubmit={handleSubmit}>
        <div className="flex items-center">
          <label className="w-1/6">Avatar (File):</label>
          <input
            type="file"
            name="avatar"
            className="w-2/6 bg-gray-100 p-2"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/6">Họ và tên:</label>
          <input
            type="text"
            name="yourname"
            value={userData.yourname}
            onChange={handleChange}
            className="w-2/6 bg-gray-100 p-2"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/6">Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleChange}
            className="w-2/6 bg-gray-100 p-2"
          />
        </div>
        <div className="flex items-center">
          <label className="w-1/6">Số điện thoại:</label>
          <div className="w-2/6">
            <input
              type="text"
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleChange}
              className="w-full bg-gray-100 p-2"
            />
            {phoneNumberError && <p className="text-red-500 text-sm mt-1">{phoneNumberError}</p>}
          </div>
        </div>
        <div className="flex items-center">
          <label className="w-1/6">Email:</label>
          <div className="w-2/6">
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full bg-gray-100 p-2"
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>
        </div>
        <div className="w-full flex justify-end">
          <button type="submit" className="btn__seemore transition text-white px-4 py-2 mt-3">
            Cập nhật thông tin
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateInformation;