import img2 from "../../assets/img/information2.jpg";

const OtherInformation = () => {
    return (
       <div className="my-8">
            <div className="section__body rounded-md bg-gray2">
                <h2 className="w-full px-4 py-2 rounded-t-md bg-title-color font-bold text-2xl">Thông tin khác về Shop Online</h2>
                <div className="grid p-4 rounded-md gap-5 grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
                    <div className="w-full h-90 order-1 md:order-1 lg:col-span-1 lg:order-none">
                    <img src={img2} alt="Thông tin khác" className="object-cover h-full w-full rounded-md" />
                    </div>
                    <div className="order-2 md:order-2 lg:order-none lg:col-span-2">
                    <h2 className="w-full font-bold text-xl mt-4 md:mt-0">Khám Phá Thêm Về Shop Online</h2>
                    <p className="text-justify mt-3">
                        Shop Online không chỉ cung cấp các sản phẩm chất lượng mà còn mang đến dịch vụ hỗ trợ tận tâm.
                        Chúng tôi cam kết mang lại trải nghiệm mua sắm tuyệt vời với chính sách bảo mật minh bạch,
                        phạm vi hoạt động rộng khắp và các chương trình ưu đãi hấp dẫn.
                    </p>
                    <div className="grid gap-5 mt-4 grid-cols-1">
                        <div className="bg-gray-100 p-4 rounded-md shadow-md">
                        <h3 className="text-purple-600 font-bold text-lg">🌍 Phạm vi hoạt động</h3>
                        <p className="text-sm mt-2">
                            Shop phục vụ khách hàng trên toàn quốc, hỗ trợ giao hàng nhanh chóng
                            với nhiều phương thức thanh toán linh hoạt.
                        </p>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-md shadow-md">
                        <h3 className="text-yellow-500 font-bold text-lg">🏅 Cam kết chất lượng</h3>
                        <p className="text-sm mt-2">
                            Chúng tôi chỉ cung cấp sản phẩm chính hãng, có nguồn gốc rõ ràng.
                            Mỗi đơn hàng đều được kiểm tra kỹ lưỡng trước khi giao đến tay khách hàng.
                        </p>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-md shadow-md">
                        <h3 className="text-cyan-500 font-bold text-lg">🔒 Chính sách bảo mật</h3>
                        <p className="text-sm mt-2">
                            Thông tin cá nhân của khách hàng được bảo mật tuyệt đối.
                            Chúng tôi áp dụng các biện pháp bảo vệ hiện đại để đảm bảo an toàn dữ liệu.
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
       </div>
  );
};

export default OtherInformation;