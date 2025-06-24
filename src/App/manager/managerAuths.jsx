import { useState, useEffect } from "react";
import { useGetUsersQuery, useRemoveUserMutation } from "../../redux/features/auth/authApi";
import { getBaseUrl } from "../../utils/baseURL";
import InformationAuth from "./base/informationAuth";
import avatarImg from "../../assets/img/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faCheck } from "@fortawesome/free-solid-svg-icons";

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
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    setSearchTerm("");
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
      setIsEditing(false);
    } else {
      setIsEditing(!isEditing);
      if (!isEditing) {
        setSelectedUsers([]);
      }
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) return;
    try {
      const response = await removeUser({ userIds: selectedUsers });
      if (response.data?.message) {
        setDeleteSuccess(true);
        
        setTimeout(() => {
          setDeleteSuccess(false);
          setSelectedUsers([]);
          setIsEditing(false);
          refetch();
        }, 1000);
      } else if (response.error) {
        alert(response.error.data?.message || "Đã xảy ra lỗi khi xóa người dùng");
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
    <>
      <div className="Manager__display--Title flex justify-between">
        <h2 className="text-xl p-4">Quản lý tài khoản</h2>
        <input
          type="text"
          id="search"
          className="w-1/3 p-2 mx-4 my-2 text-black rounded-md"
          placeholder="Tìm kiếm theo tên, email, SĐT hoặc địa chỉ"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="Manager__display--Box gap-6 p-4">
        {displayUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg">Không tìm thấy người dùng nào phù hợp</p>
          </div>
        ) : (
          displayUsers.map((user) => (
            <nav key={user._id} className="Manager__display--product rounded-md h-36 justify-between p-2">
              <div className="flex gap-2">
                <img
                  src={getAvatarUrl(user)}
                  alt={user.username}
                  className="h-32 w-32 object-cover border border-black rounded-s"
                />
                <div className="flex justify-between flex-col">
                  <h4>
                    <b>Tên tài khoản: </b>
                    {user.username}
                  </h4>
                  <div>
                    <p>
                      <b>Họ tên: </b>
                      {user.yourname || "Chưa cập nhật"}
                    </p>
                    <p>
                      <b>Email:</b> {user.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end h-full">
                {isEditing && (
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 cursor-pointer"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleSelectUser(user._id)}
                  />
                )}
                <div className="flex items-end h-full">
                    <button
                    onClick={() => handleViewInfo(user)}
                    className="flex bg-black bg-opacity-70 hover:bg-opacity-90 transition items-center text-white px-4 py-2 rounded-sm"
                    >
                    Xem thông tin
                    </button>
                </div>
              </div>
            </nav>
          ))
        )}
      </div>
      
      <div className="flex bg-black opacity-70 justify-between p-2 gap-2">
        <button
          className="text-white hover:opacity-50 px-4 py-2 rounded-sm"
          onClick={toggleEditMode}
        >
          {isEditing ? 
            (selectedUsers.length > 0 ? "Huỷ" : "Xong") 
            : "Xoá"}
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
                Xóa người dùng
              </button>
            )}
          </div>
        )}
        <div className="flex gap-2">
          {currentPage > 1 && (
            <button
              className="bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black"
              onClick={handlePreviousPage}
            >
              Trang trước
            </button>
          )}
          {currentPage < totalPages && !isSearching && (
            <button
              className="bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black"
              onClick={handleNextPage}
            >
              Trang sau
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ManagerAuths;