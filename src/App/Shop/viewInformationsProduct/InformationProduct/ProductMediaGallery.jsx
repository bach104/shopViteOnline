import { useState } from 'react';
import RatingStar from "../../../../components/RatingStars";
import { getBaseUrl } from "../../../../utils/baseURL";

const ProductMediaGallery = ({ 
  product, 
  videoUrl, 
  scrollRef,
  handleScroll 
}) => {
  const allMedia = [
    ...(videoUrl ? [{ type: 'video', url: videoUrl }] : []),
    ...(product.images?.map(img => ({
      type: 'image',
      url: `${getBaseUrl()}/${img.replace(/\\/g, "/")}`
    })) || [])
  ];

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const selectedMedia = allMedia[currentMediaIndex] || { type: 'none', url: null };

  const handleThumbnailClick = (index) => {
    setCurrentMediaIndex(index);
  };

  const toggleLightbox = () => {
    setShowLightbox(!showLightbox);
  };

  const navigateMedia = (direction) => {
    let newIndex = currentMediaIndex + direction;
    if (newIndex < 0) newIndex = allMedia.length - 1;
    if (newIndex >= allMedia.length) newIndex = 0;
    setCurrentMediaIndex(newIndex);
  };

  return (
    <div className="flex InforAllImg col-span-2 flex-col">
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={toggleLightbox}
            className="absolute top-4 right-4 text-white text-4xl"
          >
            &times;
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateMedia(-1);
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full z-10 hover:bg-opacity-75"
          >
            <i className="fa-solid fa-angle-left text-2xl"></i>
          </button>
          <div className="max-w-4xl w-full max-h-screen">
            {selectedMedia.type === 'video' ? (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : selectedMedia.type === 'image' ? (
              <img
                src={selectedMedia.url}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-white text-xl">Không có media</div>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateMedia(1);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full z-10 hover:bg-opacity-75"
          >
            <i className="fa-solid fa-angle-right text-2xl"></i>
          </button>
        </div>
      )}
      <div 
        className="w-full h-96 InforAllImg__screen bg-gray-100 flex items-center justify-center text-xl font-mono cursor-pointer"
        onClick={toggleLightbox}
      >
        {selectedMedia.type === 'video' ? (
          <video
            src={selectedMedia.url}
            controls
            className="h-full w-full object-cover"
          />
        ) : selectedMedia.type === 'image' ? (
          <img
            src={selectedMedia.url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div>Không có hình ảnh hoặc video</div>
        )}
      </div>

      <div className="relative  w-full mt-2">
        {allMedia.length > 4 && (
          <>
            <button
              onClick={() => handleScroll(-1)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-md z-10"
            >
              <i className="fa-solid fa-angle-left"></i>
            </button>
            <button
              onClick={() => handleScroll(1)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-md z-10"
            >
              <i className="fa-solid fa-angle-right"></i>
            </button>
          </>
        )}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto max-w-full whitespace-nowrap scroll-smooth no-scrollbar"
        >
          {allMedia.map((media, index) => (
            <div 
              key={index} 
              className={`h-28 w-36 flex-shrink-0 cursor-pointer border-2 ${currentMediaIndex === index ? 'border-black' : 'border-transparent'}`}
              onClick={() => handleThumbnailClick(index)}
            >
              {media.type === 'video' ? (
                <video
                  src={media.url}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={media.url}
                  alt={`Ảnh ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <h2 className="text-2xl mt-2 InforAllImg__title font-bold ">{product.name}</h2>
      <div className="mt-2 InforAllImg__star flex flex-wrap gap-4 items-end">
        <div className="text-5xl flex InforAllImg__star-rating flex-wrap items-center">
          <RatingStar rating={product.starRatings?.averageRating || 0} />
          <p className="InforAllImg__price flex items-center gap-3 text-lg font-bold ml-3">
            {product.price?.toLocaleString("vi-VN")}đ{" "}
            {product.oldPrice && (
              <span className="text-gray-600 line-through text-sm">
                {product.oldPrice.toLocaleString("vi-VN")}đ
              </span>
            )}
          </p>
        </div>
        <span>Lượt đánh giá sao: {product.starRatings?.totalReviews || 0} đánh giá </span>
      </div>
    </div>
  );
};

export default ProductMediaGallery;