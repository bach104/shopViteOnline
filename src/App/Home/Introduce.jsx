import { Link } from "react-router";
import introduce1 from "../../assets/img/introduce1.jpg";
import introduce2 from "../../assets/img/introduce2.jpg";
import introduce3 from "../../assets/img/introduce3.jpg";
const Introduce = () => {
  return (
    <section className="introduce rounded-md">
      <div className="introduceShop">
        <h4 className="introduceShop__title">Giới thiệu về shop</h4>
        <div className="introduceShop__images">
          <img src={introduce1} alt="" className="introduceShop__image introduceShop__image--large" />
          <img src={introduce2} alt="" className="introduceShop__image" />
        </div>
        <p className="introduceShop__text indent-4">
          Shoponline không chỉ mang đến trang phục mà còn là cách thể hiện cá tính, phong cách và xu hướng của giới trẻ hiện đại. Với sự sáng tạo không ngừng, thời trang dành cho giới trẻ luôn thay đổi theo từng mùa, từ những thiết kế năng động, cá tính đến phong cách thanh lịch, tối giản. Các thương hiệu thời trang ngày càng chú trọng đến chất liệu, kiểu dáng và màu sắc để đáp ứng nhu cầu đa dạng của giới trẻ. Bên cạnh đó, xu hướng thời trang bền vững cũng ngày càng được quan tâm, giúp các bạn trẻ không chỉ đẹp mà còn góp phần bảo vệ môi trường.
        </p>
        <Link to="/introduce" className="btn__seemore introduceShop__buttom justify-center transition-all flex text-white">Giới thiệu thêm</Link>
      </div>
      <div className="introduceSidebar px-6">
          <h4 className="introduceSidebar__title">Giới thiệu <br />về shop</h4>
          <Link to="/introduce" className="btn__seemore introduceSidebar__button justify-center transition-all flex text-white">Giới thiệu thêm</Link>
        <img src={introduce3} alt="" className="introduceSidebar__image introduceSidebar__image--bottom" />
      </div>
    </section>
  );
};

export default Introduce;
