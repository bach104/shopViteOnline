import ShowInformation from "./showInformation";
import UpdateInformation from "./updateInformation";

const Information = () => {
  return (
    <div className="mt-20 informationAuth">
      <ShowInformation/>
        <div className=" pt-5 boxContainer text-center font-bold">
            <h2 className="bg-gray-200 p-4">
                Cập nhật,sửa thông tin
            </h2>
        </div>
      <UpdateInformation/>
    </div>
  );
};

export default Information;