import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../redux/features/auth/authApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/auth/authSlice";

const Login = () => {
  const usernameOrEmailRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginUser] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateInputs = () => {
    const newErrors = {};
    if (!usernameOrEmailRef.current.value) {
      newErrors.usernameOrEmail = "Vui lòng nhập tên đăng nhập hoặc email";
    }
    if (!passwordRef.current.value) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    // Tắt console.error tạm thời
    const originalConsoleError = console.error;
    console.error = () => {};

    try {
      const result = await loginUser({
        usernameOrEmail: usernameOrEmailRef.current.value,
        password: passwordRef.current.value,
      }).unwrap();

      if (!result.success) {
        // Xử lý các trường hợp lỗi
        if (result.message.includes("Tên đăng nhập") || 
            result.message.includes("Không tìm thấy")) {
          setErrors({
            usernameOrEmail: "Tên đăng nhập hoặc email không đúng",
            password: ""
          });
        } else if (result.message.includes("Mật khẩu")) {
          setErrors({
            usernameOrEmail: "",
            password: "Mật khẩu không đúng"
          });
        }
        return;
      }

      // Xử lý đăng nhập thành công
      dispatch(setUser({ user: result.user }));
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
      toast.success("Đăng nhập thành công!");
      setTimeout(() => navigate("/"), 1000);

    } catch  {
      setErrors({
        usernameOrEmail: "Có lỗi xảy ra, vui lòng thử lại",
        password: ""
      });
    } finally {
      // Khôi phục console.error
      console.error = originalConsoleError;
    }
  };

  return (
    <div className="Auth">
      <div className="boxLog shadow-black m-3 pb-3 rounded-md">
        <h1 className="font-bold px-3 py-2 rounded-t-md">Đăng nhập</h1>
        <form onSubmit={handleLogin} className="p-3 mt-2">
          <div className="form-control mb-3">
            <label htmlFor="usernameOrEmail">Tên đăng nhập hoặc email:</label>
            <input
              ref={usernameOrEmailRef}
              className="p-2 rounded-md mt-2 w-full"
              type="text"
              id="usernameOrEmail"
              placeholder="Nhập email hoặc tên đăng nhập"
              onBlur={() => validateInputs()}
            />
            {errors.usernameOrEmail && <p className="text-red-500 mt-1">{errors.usernameOrEmail}</p>}
          </div>

          <div className="form-control mb-3">
            <label htmlFor="password">Mật khẩu:</label>
            <div className="relative w-full">
              <input
                ref={passwordRef}
                className="p-2 w-full rounded-md mt-2 pr-10"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Nhập mật khẩu"
                onBlur={() => validateInputs()}
              />
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                <i className={`fa-regular mt-2 ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </button>
            </div>
            {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="bg-black text-white px-3 py-2 rounded-md w-full mt-3 flex justify-center items-center"
          >
            Đăng nhập
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
          Bạn chưa có tài khoản? Ấn{" "}
          <Link className="font-bold" to="/register">
            đăng ký
          </Link>{" "}
          để tạo tài khoản
        </p>
      </div>
    </div>
  );
};

export default Login; 