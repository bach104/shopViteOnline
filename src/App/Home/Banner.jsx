import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import banner1 from "../../assets/img/banner1.png";
import banner2 from "../../assets/img/banner2.png";
import banner3 from "../../assets/img/banner3.jpg";

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const banners = [banner1, banner2, banner3];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);

    return () => clearInterval(intervalId); 
  },);
  return (
    <div className="max-width homeBanner p-4 mt-20 rounded-md header__container relative">
      <div className="absolute homeHeader z-10 ">
        <h4 className="homeHeader__title">
          Phong cách hiện đại trẻ trung
        </h4>
        <div className="flex homeHeader__button">
            <Link className="btn__header" to='/products'>Khám phá ngay</Link>
        </div>
      </div>
      <div className="header__image w-full h-full">
        {banners.map((banner, index) => (
          <img
            key={index}
            className={`slide__img ${index === activeIndex ? "active" : ""}`}
            src={banner}
            alt={`banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
