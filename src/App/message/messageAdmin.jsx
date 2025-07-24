import { useState, useRef, useEffect } from "react";
import { FaSmile, FaThumbsUp } from "react-icons/fa";
import { BsFillImageFill } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPaperPlane, faTimes, faMagnifyingGlass, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";
import { 
  useGetConversationListQuery,
  useGetMessagesWithUserQuery, 
  useSendMessageMutation 
} from '../../redux/features/messenger/messengerApi';
import moment from 'moment';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import { getBaseUrl } from "../../utils/baseURL";
import avatartest from "../../assets/img/avatar.png";

const Messenger = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [sendMessage] = useSendMessageMutation();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatArea, setShowChatArea] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 600);
  const [isSending, setIsSending] = useState(false);
  
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const messagesEndRef = useRef(null);

  function getSafeData(response, defaultValue = []) {
    return response && response.data ? response.data : defaultValue;
  }

  const { data: conversationsResponse, isLoading: convLoading, isError: convError } = useGetConversationListQuery();
  
  const { 
    data: messagesData, 
    isLoading: messagesLoading, 
    isError: messagesError,
    refetch: refetchMessages
  } = useGetMessagesWithUserQuery(selectedChat?.userId, {
    skip: !selectedChat?.userId
  });

  const conversations = getSafeData(conversationsResponse);
  const messages = getSafeData(messagesData);

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return avatartest;
    if (avatarPath.startsWith('http')) return avatarPath;
    return `${getBaseUrl()}/uploads/${avatarPath}`;
  };

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 600;
      setIsMobileView(mobileView);
      
      if (!mobileView) {
        setShowChatArea(true);
      } else if (!selectedChat) {
        setShowChatArea(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedChat]);

  useEffect(() => {
    if (conversations.length > 0 && !selectedChat) {
      setSelectedChat(conversations[0]);
    }
  }, [conversations, selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      refetchMessages();
    }
  }, [selectedChat, refetchMessages]);

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

  const filteredConversations = conversations.filter(conv => 
    conv.yourname.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)');
        return false;
      }
      
      if (file.size > maxSize) {
        alert('Kích thước file quá lớn (tối đa 5MB)');
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      const newSelectedImages = [...selectedImages, ...validFiles];
      setSelectedImages(newSelectedImages);
      
      const newImagePreviews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newImagePreviews]);
      
      setIsInputFocused(true);
    }
    
    // Reset file input to allow selecting same file again
    e.target.value = null;
  };

  const removeImage = (index) => {
    const newSelectedImages = [...selectedImages];
    const newImagePreviews = [...imagePreviews];
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newImagePreviews[index]);
    
    newSelectedImages.splice(index, 1);
    newImagePreviews.splice(index, 1);
    
    setSelectedImages(newSelectedImages);
    setImagePreviews(newImagePreviews);
    
    if (newSelectedImages.length === 0 && !inputValue.trim()) {
      setIsInputFocused(false);
    }
  };

  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation);
    if (isMobileView) {
      setShowChatArea(true);
    }
  };

  const handleBackToList = () => {
    setShowChatArea(false);
  };

  const handleSendMessage = async () => {
    const hasText = inputValue.trim().length > 0;
    const hasImages = selectedImages.length > 0;

    if (!hasText && !hasImages) return;
    
    if (!selectedChat?.userId) {
      console.error('No recipient selected');
      return;
    }

    setIsSending(true);

    try {
      let payload;
      
      if (hasImages) {
        const formData = new FormData();
        if (hasText) {
          formData.append('text', inputValue.trim());
        }
        selectedImages.forEach(image => formData.append('images', image));
        formData.append('receiverId', selectedChat.userId);
        payload = formData;
      } else {
        payload = { 
          text: inputValue.trim(),
          receiverId: selectedChat.userId 
        };
      }
      
      await sendMessage(payload).unwrap();
      
      setInputValue("");
      setSelectedImages([]);
      setImagePreviews([]);
      setIsInputFocused(false);
    } catch (error) {
      console.error('Failed to send message:', {
        status: error.status,
        data: error.data,
        originalError: error
      });
      alert('Gửi tin nhắn thất bại. Vui lòng thử lại.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendLike = async () => {
    if (!selectedChat?.userId) {
      console.error('No recipient selected');
      return;
    }

    try {
      await sendMessage({ 
        text: "👍",
        receiverId: selectedChat.userId 
      }).unwrap();
    } catch (error) {
      console.error('Failed to send like:', error);
      alert('Gửi like thất bại. Vui lòng thử lại.');
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

  if (convLoading) return <div className="container-width py-4">Loading conversations...</div>;
  if (convError) return <div className="container-width py-4">Error loading conversations</div>;

  return (
    <div>
      <div className="bg-black">
        <div className="flex py-2 text-white text-2xl items-center container-width">
          <Link to="/" className="pr-2">
            <FontAwesomeIcon icon={faHouse} />
          </Link>
          <h2>Tất cả tin nhắn</h2>
        </div>
      </div>

      <div className="messenger flex container-width">
        <div className={`sidebar ${isMobileView && showChatArea ? 'mobile-hidden' : ''}`}>
          <h2 className="chats-label text-2xl font-bold">Chats</h2>
          <div className="search-bar my-4">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input 
              type="text" 
              placeholder="Nhập tên tìm kiếm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="chat-list">
            {filteredConversations.map((conversation) => (
              <div 
                className={`chat-item ${selectedChat?.userId === conversation.userId ? 'active' : ''}`} 
                key={conversation.userId}
                onClick={() => handleSelectChat(conversation)}
              >
                <img
                  src={getAvatarUrl(conversation.avatar)}
                  alt="avatar"
                  className="chat-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = avatartest;
                  }}
                />
                <div className="chat-info">
                  <div className="chat-name font-bold">{conversation.yourname}</div>
                  <div className="chat-last opacity-40">
                    {conversation.latestMessage} - {conversation.timeAgo}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`chat-area ${isMobileView && !showChatArea ? 'mobile-hidden' : ''}`}>
          {selectedChat ? (
            <>
              <div className="chat-header">
                {isMobileView && (
                  <button className="mobile-back-button" onClick={handleBackToList}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>
                )}
                <img 
                  src={getAvatarUrl(selectedChat.avatar)} 
                  alt="avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = avatartest;
                  }}
                />
                <span>{selectedChat.yourname}</span>
              </div>
              
              <div className="chat-body">
                {messagesLoading ? (
                  <div>Loading messages...</div>
                ) : messagesError ? (
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
                              src={getAvatarUrl(selectedChat.avatar)}
                              alt=""
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = avatartest;
                              }}
                            />
                          )}
                          <div className="message-content">
                            {message.images && message.images.map((image, index) => (
                              <img
                                key={index}
                                className="chat-message__image"
                                src={`${getBaseUrl()}/uploads/${image}`}
                                alt="message content"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = avatartest;
                                }}
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
                          disabled={isSending}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="chat-input">
                <div className="relative">
                  <BsFillImageFill 
                    className="btn__iconClick"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isSending}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    disabled={isSending}
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
                    onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                    disabled={isSending}
                  />
                  <div className="chat-enterText__iconClick" ref={emojiPickerRef}>
                    <FaSmile 
                      onClick={() => !isSending && setShowEmojiPicker(!showEmojiPicker)} 
                      className="cursor-pointer"
                      disabled={isSending}
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
                    onClick={!isSending ? handleSendLike : undefined}
                    disabled={isSending}
                  />
                ) : (
                  <FontAwesomeIcon 
                    className={`btn__iconClick ${isSending ? 'opacity-50' : ''}`} 
                    icon={faPaperPlane} 
                    onClick={!isSending ? handleSendMessage : undefined}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                {conversations.length === 0 
                  ? "No conversations yet" 
                  : "Select a conversation to start chatting"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messenger;