import { FaMicrophone, FaSmile, FaThumbsUp } from "react-icons/fa";
import { BsFillImageFill } from "react-icons/bs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const Messenger = () => {
  return (
    <div>
        <div className="bg-black">
            <div className="flex py-2 text-white text-2xl items-center container-width">
                <Link to="/" className="pr-2">
                    <FontAwesomeIcon icon={faHouse} />
                </Link>
                <h2 >Tất cả tin nhắn</h2>
            </div>
        </div>
        <div className="messenger container-width">
        <div className="sidebar">
            <div className="chats-label">Chats</div>
            <div className="search-bar">
            <input type="text" placeholder="Nhập tên tìm kiếm..." />
            </div>
            <div className="chat-list">
            {[
                "Phạm hồng",
                "Hà văn hưng",
                "Đỗ Bắc",
                "Hưng",
                "Hello",
                "Đỗ thiện Lính",
                "Thu ngân",
                "Hà văn nam",
                "Thúy Nga",
                "Ngân Lê",
                "Lệ Candy",
                "Khánh canxi",
                "Loveyou",
                "Nhật Minh",
            ].map((name, index) => (
                <div className="chat-item" key={index}>
                <img
                    src={`https://i.pravatar.cc/150?img=${index + 10}`}
                    alt="avatar"
                />
                <div className="chat-info">
                    <div className="chat-name">{name}</div>
                    <div className="chat-last">You: tin nhắn gần đây - {Math.floor(Math.random() * 59) + 1}p</div>
                </div>
                </div>
            ))}
            </div>
        </div>
        <div className="chat-area">
            <div className="chat-header">
            <img src="https://i.pravatar.cc/150?img=15" alt="avatar" />
            <span>Đỗ Bắc</span>
            </div>
            <div className="chat-body">
                <div className="chat-message user">
                    <img className="chat-message__avatar" src="https://i.pravatar.cc/150?img=15" alt="" />
                    <div className="message-content">
                        <img className="chat-message__image" src="https://htmediagroup.vn/wp-content/uploads/2021/12/Ao-pijama-11-min.jpg.webp" alt="shirt" />
                        <div className="message-text">
                            <p className="rounded-md">Mình m87 89kg bạn tư vấn cho mình size với ạ</p>
                        </div>
                    </div>
                </div>
                <div className="chat-message bot">
                    <p className="rounded-md">Shop sẽ liên hệ lại với bạn sớm nhất có thể</p>
                </div>
                <div className="chat-message bot">
                    <p className="rounded-md">Dạ xin chào bạn</p>
                </div>
                <div className="chat-message bot">
                    <p className="rounded-md">Với số liệu cân nặng chiều cao bạn cho thì size 2xl là vừa với bạn</p>
                </div>

                <div className="timestamp">17:25</div>

                <div className="chat-message user">
                        <img className="chat-message__avatar" src="https://i.pravatar.cc/150?img=15" alt="" />
                    <div className="message-content">
                        <div className="message-text">
                            <p className="rounded-md">Mình cảm ơn bạn nha</p>
                        </div>
                        <div className="message-text">
                            <p className="rounded-md">Có gì mình liên hệ lại </p>
                        </div>
                        <div className="message-text">
                            <p className="rounded-md">Mình m87 89kg bạn tư vấn cho mình size với ạ</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="chat-input">
                <FaMicrophone />
                <BsFillImageFill />
                <input type="text" placeholder="Aa" />
                <FaSmile />
                <FaThumbsUp />
            </div>
        </div>
        </div>
    </div>
  );
};

export default Messenger;
