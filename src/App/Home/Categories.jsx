import { Link } from "react-router-dom"; // Sử dụng react-router-dom thay vì react-router
import category1 from "../../assets/img/category1.png";
import category2 from "../../assets/img/category2.png";
import category3 from "../../assets/img/category3.png";

const Categories = () => {
    const seasons = [
        { name: 'Thời trang đông', path: 'đông', image: category1 },
        { name: 'Thời trang hạ', path: 'hạ', image: category2 },
        { name: 'Thời trang thu', path: 'thu', image: category3 }
    ];

    return (
        <>
            <div className="product__grid rounded-md">
                <div className="box grid grid-cols-1 md:grid-cols-3 gap-4 py-6 items-center rounded-md p-4 w-full">
                    {seasons.map((season) => (
                        <nav
                            key={season.name}
                            className="h-auto rounded-md p-0 relative"
                        >
                            <img src={season.image} draggable="false" className="w-full h-full rounded-md object-center object-cover" alt={season.name} />
                            <Link to={`/store/${season.path}`} className="btn absolute bottom-5 left-5">{season.name}</Link>
                        </nav>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Categories;