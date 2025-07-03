const RatingStars = ({ rating = 0 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
        <>
            {Array.from({ length: 5 }, (_, index) => {
                if (index < fullStars) {
                    return <i key={index} className="ri-star-fill text-yellow-400"></i>;
                }
                if (index === fullStars && hasHalfStar) {
                    return <i key={index} className="ri-star-half-fill text-yellow-400"></i>;
                }
                return <i key={index} className="ri-star-line text-gray-400"></i>;
            })}
        </>
    );
};
export default RatingStars;
