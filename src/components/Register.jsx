import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../redux/features/auth/authApi";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnter, setShowReEnter] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const [errors, setErrors] = useState({});
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Tên đăng nhập không được để trống";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";

    if (!formData.password) newErrors.password = "Mật khẩu không được để trống";
    else if (formData.password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    else if (!/[A-Z]/.test(formData.password))
      newErrors.password = "Mật khẩu phải chứa ít nhất một chữ cái viết hoa";
    else if (!/[a-z]/.test(formData.password))
      newErrors.password = "Mật khẩu phải chứa ít nhất một chữ cái viết thường";
    else if (!/[0-9]/.test(formData.password))
      newErrors.password = "Mật khẩu phải chứa ít nhất một số";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
      newErrors.password = "Mật khẩu phải chứa ít nhất một ký tự đặc biệt";

    if (formData.password !== formData.rePassword)
      newErrors.rePassword = "Mật khẩu nhập lại không khớp";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      if (result.message) {
        alert(result.message);
        navigate("/dang_nhap");
      }
    } catch (error) {
      const serverError = error.data || {};
      const newErrors = {};

      if (serverError.message) {
        if (
          serverError.message.includes("Tên đăng nhập đã tồn tại") ||
          serverError.message.includes("Tên người dùng đã tồn tại")
        ) {
          newErrors.username = "Tên đăng nhập đã tồn tại";
        }
        if (serverError.message.includes("Email đã tồn tại")) {
          newErrors.email = "Email này đã được sử dụng";
        }

        if (!newErrors.username && !newErrors.email) {
          newErrors.server = serverError.message;
        }
      } else {
        newErrors.server = "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!";
      }

      setErrors(newErrors);
    }
  };

  return (
    <div className="Auth">
      <div className="boxLog shadow-black m-3 pb-3 rounded-md">
        <h1 className="font-bold px-3 py-2 rounded-t-md">Đăng ký</h1>
        <form onSubmit={handleSubmit} className="p-3 mt-2">
          <div className="form-control mb-3">
            <label htmlFor="username">Tên đăng nhập:</label>
            <input
              className={`p-2 rounded-md mt-2 w-full ${
                errors.username ? "border border-red-500" : ""
              }`}
              type="text"
              name="username"
              id="username"
              value={formData.username}
              placeholder="Tạo tên đăng nhập"
              onChange={handleChange}
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div className="form-control mb-3">
            <label htmlFor="email">Email:</label>
            <input
              className={`p-2 rounded-md mt-2 w-full ${
                errors.email ? "border border-red-500" : ""
              }`}
              type="email"
              name="email"
              id="email"
              value={formData.email}
              placeholder="Nhập email"
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="form-control mb-3">
            <label htmlFor="password">Tạo mật khẩu:</label>
            <div className="relative w-full">
              <input
                className={`p-2 w-full rounded-md mt-2 pr-10 ${
                  errors.password ? "border border-red-500" : ""
                }`}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                placeholder="Tạo mật khẩu"
                onChange={handleChange}
                autoComplete="new-password"
              />
              <i
                className={`fa-regular absolute right-3 top-1/2 -translate-y-1/2 mt-1 cursor-pointer ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                }`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="form-control mb-3">
            <label htmlFor="rePassword">Nhập lại mật khẩu:</label>
            <div className="relative w-full">
              <input
                className={`p-2 w-full rounded-md mt-2 pr-10 ${
                  errors.rePassword ? "border border-red-500" : ""
                }`}
                type={showReEnter ? "text" : "password"}
                name="rePassword"
                id="rePassword"
                value={formData.rePassword}
                placeholder="Nhập lại mật khẩu"
                onChange={handleChange}
                autoComplete="new-password"
              />
              <i
                className={`fa-regular absolute right-3 top-1/2 -translate-y-1/2 mt-1 cursor-pointer ${
                  showReEnter ? "fa-eye" : "fa-eye-slash"
                }`}
                onClick={() => setShowReEnter(!showReEnter)}
              ></i>
            </div>
            {errors.rePassword && (
              <p className="text-red-500 text-sm mt-1">{errors.rePassword}</p>
            )}
          </div>

          {/* Chỉ hiển thị lỗi server khi không phải lỗi username hoặc email */}
          {errors.server && !errors.username && !errors.email && (
            <p className="text-red-500 text-sm text-center mb-3">
              {errors.server}
            </p>
          )}

          <button
            type="submit"
            className="bg-black text-white px-3 py-2 rounded-md w-full mt-3"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </button>
          <button
            type="button"
            className="bg-black text-white px-3 py-2 rounded-md w-full mt-3 gap-2 flex items-center justify-center"
          >
            <span>
              <i className="fa-brands fa-google"></i>
            </span>
            Đăng nhập bằng Google
          </button>
        </form>
        <p className="p-3">
          Bạn đã có tài khoản?{" "}
          <Link className="font-bold" to="/dang_nhap">
            Đăng nhập
          </Link>{" "}
          để vào shop
        </p>
      </div>
    </div>
  );
};

export default Register;