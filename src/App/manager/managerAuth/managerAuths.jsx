import { useState, useEffect, Fragment } from "react";
import { useGetUsersQuery, useRemoveUserMutation } from "../../../redux/features/auth/authApi";
import { getBaseUrl } from "../../../utils/baseURL";
import InformationAuth from "../base/informationAuth";
import avatarImg from "../../../assets/img/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faCheck } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../base/Pagination";
import MenuMobile from "../base/managerMenuMobile";
import DesktopManagerItems from "./DesktopAuthItems";
import MobileManagerItems from "./MobileAuthItems";

const ManagerAuths = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const { data, isLoading, isError, refetch } = useGetUsersQuery({
    page: currentPage,
    limit: 20,
  });
  const [removeUser] = useRemoveUserMutation();

  useEffect(() => {
    if (data?.users) {
      if (searchTerm.trim() === "") {
        setFilteredUsers(data.users);
        setIsSearching(false);
      } else {
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = data.users.filter(user =>
          (user.username && user.username.toLowerCase().includes(searchTermLower)) ||
          (user.yourname && user.yourname.toLowerCase().includes(searchTermLower)) ||
          (user.email && user.email.toLowerCase().includes(searchTermLower)) ||
          (user.phoneNumber && user.phoneNumber.includes(searchTerm)) ||
          (user.address && user.address.toLowerCase().includes(searchTermLower))
        );
        setFilteredUsers(filtered);
        setIsSearching(true);
      }
    }
  }, [data, searchTerm]);

  const handleViewInfo = (user) => {
    setSelectedUser(user);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedUser(null);
  };

  const handleNextPage = () => {
    if (currentPage < (data?.totalPages || 1)) {
      setCurrentPage((prevPage) => prevPage + 1);
      setSearchTerm("");
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      setSearchTerm("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getAvatarUrl = (user) => {
    if (user.avatar) {
      return `${getBaseUrl()}/${user.avatar.replace(/\\/g, "/")}`;
    }
    return avatarImg;
  };

  const toggleEditMode = () => {
    if (isEditing && selectedUsers.length > 0) {
      setSelectedUsers([]);
    }
    setIsEditing(!isEditing);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      const response = await removeUser({ userIds: selectedUsers });
      
      if (response.data?.success) {
        setDeleteSuccess(true);
        setTimeout(() => {
          setDeleteSuccess(false);
          setSelectedUsers([]);
          setIsEditing(false);
          refetch();
        }, 1000);
      } else {
        alert(response.error?.data?.message || "Đã xảy ra lỗi khi xóa người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      alert("Đã xảy ra lỗi khi xóa người dùng");
    }
  };

  if (viewMode === 'detail') {
    return <InformationAuth user={selectedUser} onBack={handleBackToList} />;
  }

  if (isLoading) return <div className="text-center py-8">Đang tải dữ liệu...</div>;
  if (isError) return <div className="text-center py-8 text-red-500">Lỗi khi tải danh sách người dùng</div>;

  const totalPages = data?.totalPages || 1;
  const displayUsers = isSearching ? filteredUsers : data?.users || [];

  return (
    <div className="ManagerAuths">
      <div className="Manager__display--Title flex justify-between items-center">
        <div className="flex items-center px-2 gap-1">
          <MenuMobile/>
          <h2 className="text-xl p-4">Quản lý tài khoản</h2>
        </div>
        <input
          type="text"
          id="search"
          className="w-1/3 p-2 mx-4 my-2 text-black rounded-md"
          placeholder="Tìm kiếm theo tên, email, SĐT hoặc địa chỉ"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="Manager__display--Box mobile gap-6 p-4">
        {displayUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg">Không tìm thấy người dùng nào phù hợp</p>
          </div>
        ) : (
          displayUsers.map((user) => (
            <Fragment key={`user-${user._id}`}>
              <DesktopManagerItems
                user={user}
                getAvatarUrl={getAvatarUrl}
                isEditing={isEditing}
                selectedUsers={selectedUsers}
                handleSelectUser={handleSelectUser}
                handleViewInfo={handleViewInfo}
              />
              <MobileManagerItems
                user={user}
                getAvatarUrl={getAvatarUrl}
                isEditing={isEditing}
                selectedUsers={selectedUsers}
                handleSelectUser={handleSelectUser}
                handleViewInfo={handleViewInfo}
              />
            </Fragment>
          ))
        )}
      </div>
      
      <div className="flex bg-black opacity-70 justify-between p-2 gap-2">
        <button
          className={`text-white hover:opacity-50 px-4 py-2 rounded-sm ${isEditing ? 'bg-gray-600' : ''}`}
          onClick={toggleEditMode}
        >
          {isEditing ? (selectedUsers.length > 0 ? "Huỷ" : "Xong") : "Xoá"}
        </button>
        
        {isEditing && selectedUsers.length > 0 && (
          <div>
            {deleteSuccess ? (
              <button 
                className="text-white bg-green-700 gap-4 flex items-center hover:bg-green-800 px-4 py-2 rounded-sm"
                disabled
              >
                <FontAwesomeIcon icon={faCheck} />
                Xoá người dùng thành công
              </button>
            ) : (
              <button 
                className="text-white bg-red-600 transition gap-4 flex items-center hover:bg-red-700 px-4 py-2 rounded-sm"
                onClick={handleDeleteUsers}
              >
                <FontAwesomeIcon icon={faTrashCan} />
                Xóa {selectedUsers.length} người dùng
              </button>
            )}
          </div>
        )}
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePreviousPage}
          onNextPage={handleNextPage}
          searchTerm={isSearching ? searchTerm : ""}
        />
      </div>
    </div>
  );
};

export default ManagerAuths;