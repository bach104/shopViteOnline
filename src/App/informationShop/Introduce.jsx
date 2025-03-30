import img1 from "../../assets/img/information3.jpg";

const Introduce = () => {
    return (
      <div className="my-8">
        <div className="section__body product__list">
            <h2 className="w-full p-4 text-2xl font-bold text-center bg-gray-400">Giới thiệu</h2>
            
            <div className="grid p-4 rounded-md gap-5 grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
                <div className="w-full h-90 order-1 md:order-1 lg:col-span-2 lg:order-none">
                    <img src={img1} alt="Giới thiệu" className="object-cover h-full w-full" />
                </div>

                <div className="order-2 md:order-2 lg:order-none">
                    <h2 className="w-full font-bold text-xl mt-4 md:mt-0">Giới Thiệu Về Shop Online</h2>
                    <div className="max-h-full mt-3">
                        <p className="text-justify">
                        Trong thời đại công nghệ phát triển mạnh mẽ, mua sắm online đã trở thành xu hướng phổ biến, 
                        mang đến sự tiện lợi và đa dạng lựa chọn cho khách hàng. Shop online không chỉ giúp tiết kiệm thời gian 
                        mà còn mang đến những trải nghiệm mua sắm nhanh chóng, tiện lợi và an toàn.
                        </p>
                        <div className="grid gap-5 mt-4 grid-cols-1">
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                <h3 className="text-green-600 font-bold text-lg">🛍️ Sản phẩm đa dạng</h3>
                                <p className="text-sm mt-2">
                                Shop online cung cấp nhiều mặt hàng phong phú từ thời trang, mỹ phẩm, đồ điện tử,
                                đến đồ gia dụng và thực phẩm. Tất cả sản phẩm đều được chọn lọc kỹ lưỡng, đảm bảo chất lượng.
                                </p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                <h3 className="text-blue-500 font-bold text-lg">📞 Hỗ trợ tận tình</h3>
                                <p className="text-sm mt-2">
                                Với tiêu chí đặt khách hàng lên hàng đầu, shop luôn hỗ trợ tư vấn tận tâm,
                                giải đáp mọi thắc mắc nhanh chóng. Chính sách đổi trả linh hoạt, giao hàng nhanh chóng.
                                </p>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                                <h3 className="text-red-500 font-bold text-lg">🎁 Ưu đãi hấp dẫn</h3>
                                <p className="text-sm mt-2">
                                Shop thường xuyên có các chương trình khuyến mãi, giảm giá, tặng quà nhằm tri ân khách hàng.
                                Hệ thống thanh toán linh hoạt giúp mua sắm dễ dàng.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
  );
};

export default Introduce;
