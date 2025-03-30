const Loader = ({ size = 'medium' }) => {
    const sizes = {
      small: 'w-5 h-5',
      medium: 'w-8 h-8',
      large: 'w-12 h-12'
    };
  
    return (
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-yellow-500 ${sizes[size]}`}></div>
    );
  };
  
  export default Loader;