import PropTypes from 'prop-types';

const DesktopManagerItems = ({ 
  user, 
  getAvatarUrl, 
  isEditing, 
  selectedUsers, 
  handleSelectUser, 
  handleViewInfo
}) => {
  return (
    <nav className="Manager__display--product Manager__display--Tablet rounded-md h-36 justify-between p-2">
      <div className="flex ProInfor gap-2">
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
  );
};

DesktopManagerItems.propTypes = {
  user: PropTypes.object.isRequired,
  getAvatarUrl: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  selectedUsers: PropTypes.array.isRequired,
  handleSelectUser: PropTypes.func.isRequired,
  handleViewInfo: PropTypes.func.isRequired
};

export default DesktopManagerItems;