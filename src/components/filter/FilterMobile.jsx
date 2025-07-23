import React, { useCallback, useMemo, useState } from 'react';

const categories = [
  { name: "Chất liệu", key: "material", sub: ["Bò", "Vải", "Kaki"] },
  { name: "Loại", key: "category", sub: ["Quần", "Áo", "Vest", "Váy"] },
  { name: "Mùa", key: "season", sub: ["Thu", "Đông", "Hạ"] },
];

const formatPrice = (price) => price ? price.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";

const FilterComponent = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = useCallback((type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: value.replace(/\D/g, "") }
    }));
  }, [setFilters]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => {
      const newSet = new Set(prev[key]);
      newSet.has(value) ? newSet.delete(value) : newSet.add(value);
      return { ...prev, [key]: newSet };
    });
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    setFilters({
      material: new Set(),
      category: new Set(),
      season: new Set(),
      priceRange: { min: "", max: "" },
    });
  }, [setFilters]);

  const handleApplyFilters = useCallback(() => {
    setIsOpen(false);
  }, []);

  const renderedCategories = useMemo(() => categories.map(({ name, key, sub }) => (
    <ul key={key} className="product__list">
      <div className=" flex p-4 items-center">
        <i className="fa-solid fa-caret-right pr-3"></i>
        <h4>{name}</h4>
      </div>
      {sub.map((value) => {
        const normalizedValue = value.trim().toLowerCase();
        return (
          <span key={value} className="pl-8 flex">
            <input
              className="mr-3"
              type="checkbox"
              name={key}
              checked={filters[key]?.has(normalizedValue)}
              onChange={() => handleFilterChange(key, normalizedValue)}
              id={`${key}-${value}`}
            />
            <label className="w-full p-2 block cursor-pointer" htmlFor={`${key}-${value}`}>{value}</label>
          </span>
        );
      })}
    </ul>
  )), [filters, handleFilterChange]);

  return (
    <div className="relative">
      <div 
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fa-solid fa-filter hover:opacity-50"></i>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div 
        className={`sectionCheckFilter--mobile bg-white z-20 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="overflow-y-auto h-full">
          {renderedCategories}
          <ul className="">
              <div className=" flex p-4 items-center">
              <i className="fa-solid fa-caret-right pr-3"></i>
              <h4>Giá</h4>
              </div>
              <div className="flex w-full justify-center items-center p-2 ">
              <input
                  type="text"
                  name="price-min"
                  className="w-full border border-black p-2"
                  placeholder="giá từ"
                  value={formatPrice(filters.priceRange.min)}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
              />
              <i className="ri-arrow-right-fill pl-2 pr-2"></i>
              <input
                  type="text"
                  name="price-max"
                  className="w-full border border-black p-2"
                  placeholder="đến giá"
                  value={formatPrice(filters.priceRange.max)}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
              />
              </div>
          </ul>
          <div className=" flex flex-col">
              <button className="bg-gray-200 p-3" onClick={handleClearFilters}>Xóa bộ lọc</button>
          </div>
          <div className=" flex flex-col">
              <button 
                className="p-4 bg-black text-white" 
                onClick={handleApplyFilters}
              >
                Lọc
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default React.memo(FilterComponent);