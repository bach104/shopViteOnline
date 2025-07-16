import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
const navbarMobile = () => {
  return (
    <div className>
        <nav className="cursor-pointer text-2xl">
            <FontAwesomeIcon icon={faBars} />
        </nav>
    </div>
  )
}

export default navbarMobile
