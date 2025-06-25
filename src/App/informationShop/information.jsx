import StoreBanner from "../../components/StoreBanner"
import ContactInformation from "./ContactInformation"
import Introduce from "./Introduce"
import OtherInformation from "./OtherInformation"

const information = () => {
  return (
    <>
        <section className="store__container relative">
            <StoreBanner />
            <div className="absolute p-3 store__title top-10 left-10 z-10 rounded-md">
            <h4 className="text-5xl text-white">
                Giới thiệu về shop
            </h4>
            <p className="text-white mt-3">Mô tả về Shoponline</p>
            </div>
        </section>
        <Introduce/>
        <OtherInformation/>
        <ContactInformation/>
    </>
  )
}
export default information