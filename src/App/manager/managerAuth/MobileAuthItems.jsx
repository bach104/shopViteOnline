import PropTypes from 'prop-types';

const MobileManagerItems = ({ 
  user, 
  getAvatarUrl, 
  isEditing, 
  selectedUsers, 
  handleSelectUser, 
  handleViewInfo
}) => {
  return (
    <nav key={`mobile-${user._id}`} className="Manager__display--product Manager__display--Mobile rounded-md gap-2 h-32 justify-between p-1">
        <img
            src={getAvatarUrl(user)}
            alt={user.username}
            className="h-full w-28 object-cover border border-black rounded-s"
        />
        <div className="w-full">
            <div className="flex flex-col">
            <h4>
                <b>Tên tài khoản: </b>
                {user.username}
            </h4>
            <div>
                <p>
                <b>Họ tên: </b>
                {user.yourname || "Chưa cập nhật"}
                </p>
                <p className="line__limit--one w-full">
                <b>Email:</b> {user.email}
                </p>
            </div>
            </div>
            <div className="flex justify-between h-full items-end">
            {isEditing && (
                <input 
                type="checkbox" 
                className="w-5 h-5 cursor-pointer"
                checked={selectedUsers.includes(user._id)}
                onChange={() => handleSelectUser(user._id)}
                />
            )}
            <div className="flex w-full justify-end items-end h-full">
                <button
                onClick={() => handleViewInfo(user)}
                className="flex bg-black bg-opacity-70 hover:bg-opacity-90 transition items-center text-white px-4 py-2 rounded-sm"
                >
                Xem thông tin
                </button>
            </div>
            </div>
        </div>
    </nav>
  );
};
MobileManagerItems.propTypes = {
  user: PropTypes.object.isRequired,
  getAvatarUrl: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  selectedUsers: PropTypes.array.isRequired,
  handleSelectUser: PropTypes.func.isRequired,
  handleViewInfo: PropTypes.func.isRequired
};
export default MobileManagerItems;