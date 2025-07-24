import { useState, useRef, useEffect } from "react";
import { FaSmile, FaThumbsUp } from "react-icons/fa";
import { BsFillImageFill } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";
import { useGetMessagesWithUserQuery, useSendMessageMutation } from "../../redux/features/messenger/messengerApi";
import moment from "moment";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

const Messenger = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [sendMessage] = useSendMessageMutation();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showNameWarning, setShowNameWarning] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { data: messagesData, isLoading, isError } = useGetMessagesWithUserQuery(
    currentUser?.role === 'admin' ? undefined : undefined
  );
  function getSafeData(response, defaultValue = []) {
  return response && response.data ? response.data : defaultValue;
}
  const messages = getSafeData(messagesData);
  const hasUpdatedName = currentUser?.yourname && currentUser.yourname.trim() !== '';
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    if (!inputValue.trim() && selectedImages.length === 0) {
      setIsInputFocused(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.trim() || selectedImages.length > 0) {
      setIsInputFocused(true);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInputValue(prev => prev + emojiData.emoji);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const newSelectedImages = [...selectedImages, ...files];
      setSelectedImages(newSelectedImages);
      
      const newImagePreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newImagePreviews]);
      
      setIsInputFocused(true);
    }
  };

  const removeImage = (index) => {
    const newSelectedImages = [...selectedImages];
    const newImagePreviews = [...imagePreviews];
    
    newSelectedImages.splice(index, 1);
    newImagePreviews.splice(index, 1);
    
    setSelectedImages(newSelectedImages);
    setImagePreviews(newImagePreviews);
    
    if (newSelectedImages.length === 0 && !inputValue.trim()) {
      setIsInputFocused(false);
    }
  };

  const handleSendMessage = async () => {
    if (!hasUpdatedName) {
      setShowNameWarning(true);
      setTimeout(() => setShowNameWarning(false), 3000);
      return;
    }

    const hasText = inputValue.trim().length > 0;
    const hasImages = selectedImages.length > 0;

    if (hasText || hasImages) {
      try {
        let payload;
        
        if (hasImages) {
          const formData = new FormData();
          if (hasText) {
            formData.append('text', inputValue.trim());
          }
          selectedImages.forEach(image => formData.append('images', image));
          payload = formData;
        } else {
          payload = { text: inputValue.trim() };
        }
        await sendMessage(payload).unwrap();
        
        setInputValue("");
        setSelectedImages([]);
        setImagePreviews([]);
        setIsInputFocused(false);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleSendLike = async () => {
    if (!hasUpdatedName) {
      setShowNameWarning(true);
      setTimeout(() => setShowNameWarning(false), 3000);
      return;
    }

    try {
      await sendMessage({ text: "👍" }).unwrap();
    } catch (error) {
      console.error('Failed to send like:', error);
    }
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach(message => {
      const date = moment(message.createdAt).format('YYYY-MM-DD');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div>
      <div className="bg-black">
        <div className="flex py-2 text-white text-2xl items-center container-width">
          <Link to="/" className="pr-2">
            <FontAwesomeIcon icon={faHouse} />
          </Link>
          <h2>Tin nhắn</h2>
        </div>
      </div>
      <div className="messenger container-width">
        <div className="chat-area">
          <div className="chat-header">
            <img src="https://i.pravatar.cc/150?img=15" alt="avatar" />
            <span>Admin</span>
          </div>
          <div className="chat-body">
            {isLoading ? (
              <div>Loading messages...</div>
            ) : isError ? (
              <div>Error loading messages</div>
            ) : (
              Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="timestamp">
                    {moment(date).calendar(null, {
                      sameDay: '[Hôm nay]',
                      nextDay: '[Ngày mai]',
                      nextWeek: 'dddd',
                      lastDay: '[Hôm qua]',
                      lastWeek: '[Tuần trước] dddd',
                      sameElse: 'DD/MM/YYYY'
                    })}
                  </div>
                  {dateMessages.map((message) => (
                    <div 
                      key={message._id} 
                      className={`chat-message ${message.sender === currentUser?._id ? 'user' : 'bot'}`}
                    >
                      {message.sender !== currentUser?._id && (
                        <img
                          className="chat-message__avatar"
                          src="https://i.pravatar.cc/150?img=15"
                          alt=""
                        />
                      )}
                      <div className="message-content">
                        {message.images && message.images.map((image, index) => (
                          <img
                            key={index}
                            className="chat-message__image"
                            src={`${import.meta.env.VITE_API_URL}/uploads/${image}`}
                            alt="message content"
                          />
                        ))}
                        {message.text && (
                          <div className="message-text">
                            <p className="rounded-md">{message.text}</p>
                          </div>
                        )}
                      </div>
                      <div className="message-time">
                        {moment(message.createdAt).format('HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
            {imagePreviews.length > 0 && (
              <div className="image-preview-container">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview} alt={`preview-${index}`} />
                    <button 
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))} 
              </div>
            )}
          </div>
          <div className="chat-input">
            {showNameWarning && (
              <div className="chat-toast show">
                Bạn cần cập nhật tên để có thể nhắn tin
              </div>
            )}
            <div className="relative">
              <BsFillImageFill 
                className="btn__iconClick"
                onClick={() => fileInputRef.current.click()}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                style={{ display: 'none' }}
              />
            </div>
            <div className="chat-enterText">
              <input
                type="text"
                placeholder="Aa"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                value={inputValue}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <div className="chat-enterText__iconClick" ref={emojiPickerRef}>
                <FaSmile 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                  className="cursor-pointer"
                />
                {showEmojiPicker && (
                  <div className="absolute bottom-10 right-0 z-10">
                    <EmojiPicker 
                      onEmojiClick={handleEmojiClick}
                      width={300}
                      height={350}
                      previewConfig={{ showPreview: false }}
                    />
                  </div>
                )}
              </div>
            </div>
            {!isInputFocused && !inputValue.trim() && selectedImages.length === 0 ? (
              <FaThumbsUp 
                className="btn__iconClick" 
                onClick={handleSendLike}
              />
            ) : (
              <FontAwesomeIcon 
                className="btn__iconClick" 
                icon={faPaperPlane} 
                onClick={handleSendMessage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;