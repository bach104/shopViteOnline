import { useState, useEffect } from "react";
import { 
  useGetProductsQuery,
  useDeleteProductMutation 
} from "../../../redux/features/shop/productsApi";
import { Outlet, useNavigate } from "react-router-dom";
import AddProducts from "./addProducts";
import { getBaseUrl } from "../../../utils/baseURL";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faCheck } from "@fortawesome/free-solid-svg-icons";

const ManagerProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const navigate = useNavigate();
  
  const { data, isLoading, isError, refetch } = useGetProductsQuery({
    page: currentPage,
    limit: 20,
  });

  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (data?.products) {
      if (searchTerm.trim() === "") {
        setFilteredProducts(data.products);
        setIsSearching(false);
      } else {
        const filtered = data.products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
        setIsSearching(true);
      }
    }
  }, [data, searchTerm]);

  const handleCloseAddProduct = () => {
    setShowAddProduct(false);
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

  const toggleEditMode = () => {
    if (isEditing) {
      setSelectedProducts([]);
    }
    setIsEditing(!isEditing);
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleDeleteProducts = async () => {
    try {
      const deleteData = selectedProducts.length === 1 
        ? { productId: selectedProducts[0] }
        : { productIds: selectedProducts };

      await deleteProduct(deleteData).unwrap();
      
      setDeleteSuccess(true);
      
      setTimeout(() => {
        setDeleteSuccess(false);
        setSelectedProducts([]);
        setIsEditing(false);
        refetch();
      }, 1000);
      
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  const totalPages = data?.totalPages || 1;
  const displayProducts = isSearching ? filteredProducts : data.products;

  return (
    <>
      <div className="Manager__display--Title flex justify-between">
        <h2 className="text-xl p-4">Quản lý sản phẩm</h2>
        <input
          type="text"
          id="search"
          className="w-1/3 p-2 mx-4 my-2 text-black rounded-md"
          placeholder="Tìm kiếm sản phẩm"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="Manager__display--Box gap-6 p-4">
        {displayProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg">Không tìm thấy sản phẩm nào phù hợp</p>
          </div>
        ) : (
          displayProducts.map((product, index) => {
            const imageUrl = product.images[0]
              ? `${getBaseUrl()}/${product.images[0].replace(/\\/g, "/")}`
              : "https://via.placeholder.com/112";

            return (
              <nav key={index} className="Manager__display--product rounded-md h-36 justify-between p-2">
                <div className="flex w-2/3 gap-2">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-32 w-32 object-cover border border-black rounded-s"
                  />
                  <div className="flex justify-between flex-col">
                    <p><b>Tên sản phẩm:</b> {product.name}</p>
                    <div>
                      <p>
                        <span>
                          <b>Giá bán:</b> {product.price.toLocaleString()}đ
                        </span>
                        {product.oldPrice && (
                          <s className="ml-3">{product.oldPrice.toLocaleString()}đ</s>
                        )}
                      </p>
                      <p>
                        <span><b>Số lượng:</b> {product.quantity}</span>
                        <span className="ml-3"><b>Đã bán:</b> {product.sold}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between h-full items-end">
                  <input 
                    type="checkbox" 
                    className="h-5 w-5"
                    checked={isEditing && selectedProducts.includes(product._id)}
                    onChange={() => handleCheckboxChange(product._id)}
                    style={{ visibility: isEditing ? 'visible' : 'hidden' }}
                  />
                  <div className="flex items-end h-full">
                    <button
                      className="flex bg-black bg-opacity-70 hover:bg-opacity-90 transition items-center text-white px-4 py-2 rounded-sm"
                      onClick={() => navigate(`products/${product._id}`)} 
                    >
                      Chi tiết sản phẩm
                    </button>
                  </div>
                </div>
              </nav>
            );
          })
        )}
      </div>
      <div className="flex bg-black opacity-70 justify-between p-2 gap-2">
        <div>
          <button
            className="text-white px-4 py-2 hover:opacity-50 rounded-sm"
            onClick={() => setShowAddProduct(true)}
          >
            Thêm sản phẩm
          </button>
          <button
            className="text-white hover:opacity-50 px-4 py-2 rounded-sm"
            onClick={toggleEditMode}
          >
            {isEditing ? (selectedProducts.length > 0 ? "Huỷ" : "Xong") : "Xoá"}
          </button>
        </div>
        {isEditing && selectedProducts.length > 0 && (
          <>
            {deleteSuccess ? (
              <button 
                className="text-white bg-green-700 gap-4 flex items-center hover:bg-green-800 px-4 py-2 rounded-sm"
                disabled
              >
                <FontAwesomeIcon icon={faCheck} />
                Xoá sản phẩm thành công
              </button>
            ) : (
              <button 
                className="text-white bg-red-600 transition gap-4 flex items-center hover:bg-red-700 px-4 py-2 rounded-sm"
                onClick={handleDeleteProducts}
              >
                <FontAwesomeIcon icon={faTrashCan} />
                Xóa
              </button>
            )}
          </>
        )}
        <div className="flex gap-2">
          {currentPage > 1 && (
            <button
              className="bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black"
              onClick={handlePreviousPage}
            >
              Quay lại trang trước
            </button>
          )}
          {currentPage < totalPages && !isSearching && (
            <button
              className="bg-white font-bold shadow-md px-4 py-2 rounded-md hover:opacity-90 transition text-black"
              onClick={handleNextPage}
            >
              Trang kế tiếp
            </button>
          )}
        </div>
      </div>
      
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <AddProducts onClose={handleCloseAddProduct} />
        </div>
      )}
      <Outlet />
    </>
  );
};

export default ManagerProducts;