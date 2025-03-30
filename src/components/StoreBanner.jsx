import { useEffect, useState } from "react";
import img1 from "../assets/img/banner4.png";
import img2 from "../assets/img/banner5.png";
import img3 from "../assets/img/banner6.png";

const StoreBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const imgs = [img1, img2, img3];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % imgs.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [imgs.length]); 
  return (
    <div className="header__image">
      {imgs.map((img, index) => (
        <img
          key={index}
          className={`slide__img ${index === activeIndex ? "active" : "hidden"}`}
          src={img}
          alt={`img ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default StoreBanner;
