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
    <div className="max-width p-4 mt-20 rounded-md header__container relative">
      <div className="absolute z-10 bottom-5 sm:bottom-10 md:bottom-10 lg:bottom-20 left-5 sm:left-10 md:left-10 lg:left-20 w-full sm:w-auto">
      <h4 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl text-white w-full sm:w-96 title mb-4 text-center sm:text-left">
        Phong cách hiện đại trẻ trung
      </h4>
      <div className="flex justify-center sm:justify-start">
          <Link className="btn" to='/products'>Khám phá ngay</Link>
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
