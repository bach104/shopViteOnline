import { useState, useEffect } from "react";
import { 
  useGetProductsQuery,
  useDeleteProductMutation 
} from "../../../redux/features/shop/productsApi";
import { Outlet, useNavigate } from "react-router-dom";
import AddProducts from "./addProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faCheck } from "@fortawesome/free-solid-svg-icons";
import MobileProductItem from "./MobileProductItem.jsx";
import DesktopProductItem from "./DesktopProductItem";

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

  const navigateToDetail = (productId) => {
    navigate(`products/${productId}`);
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
      
      <div className="Manager__display--Box gap-6 mobile p-4">
        {displayProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg">Không tìm thấy sản phẩm nào phù hợp</p>
          </div>
        ) : (
          displayProducts.map((product, index) => (
            <>
              <DesktopProductItem 
                key={`desktop-${index}`}
                product={product}
                index={index}
                isEditing={isEditing}
                selectedProducts={selectedProducts}
                handleCheckboxChange={handleCheckboxChange}
                navigateToDetail={navigateToDetail}
              />
              <MobileProductItem 
                key={`mobile-${index}`}
                product={product}
                isEditing={isEditing}
                selectedProducts={selectedProducts}
                handleCheckboxChange={handleCheckboxChange}
                navigateToDetail={navigateToDetail}
              />
            </>
          ))
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