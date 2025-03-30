import React, { useCallback, useMemo } from 'react';

const categories = [
  { name: "Chất liệu", key: "material", sub: ["Bò", "Vải", "Kaki"] },
  { name: "Loại", key: "category", sub: ["Quần", "Áo", "Vest", "Váy"] },
  { name: "Mùa", key: "season", sub: ["Thu", "Đông", "Hạ"] },
];

const formatPrice = (price) => price ? price.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";

const FilterComponent = ({ filters, setFilters }) => {
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

  const renderedCategories = useMemo(() => categories.map(({ name, key, sub }) => (
    <ul key={key} className="product__list">
      <div className="bg__div flex p-4 items-center">
        <i className="fa-solid fa-caret-right pr-3"></i>
        <h4>{name}</h4>
      </div>
      {sub.map((value) => {
        const normalizedValue = value.trim().toLowerCase();
        return (
          <li key={value} className="pl-8 p-2 flex bg-slate-200">
            <input
              className="mr-3"
              type="checkbox"
              name={key}
              checked={filters[key]?.has(normalizedValue)}
              onChange={() => handleFilterChange(key, normalizedValue)}
              id={`${key}-${value}`}
            />
            <label className="w-full block cursor-pointer" htmlFor={`${key}-${value}`}>{value}</label>
          </li>
        );
      })}
    </ul>
  )), [filters, handleFilterChange]);

  return (
    <div className="w-1/4 bg__filter">
      <div className="bg__header flex justify-between items-center p-3.5">
        <h4 className="font-bold text-xl">Lọc theo</h4>
        <i className="fa-solid fa-filter"></i>
      </div>
      {renderedCategories}
      <ul className="product__list">
        <div className="bg__div flex p-4 items-center">
          <i className="fa-solid fa-caret-right pr-3"></i>
          <h4>Giá</h4>
        </div>
        <div className="flex w-full justify-center items-center p-2 bg__div">
          <input
            type="text"
            name="price-min"
            className="w-32 p-2"
            placeholder="giá từ"
            value={formatPrice(filters.priceRange.min)}
            onChange={(e) => handlePriceChange("min", e.target.value)}
          />
          <i className="ri-arrow-right-fill pl-2 pr-2"></i>
          <input
            type="text"
            name="price-max"
            className="w-32 p-2"
            placeholder="đến giá"
            value={formatPrice(filters.priceRange.max)}
            onChange={(e) => handlePriceChange("max", e.target.value)}
          />
        </div>
      </ul>
      <div className="bg__div flex flex-col">
        <button className="bg__header p-3" onClick={handleClearFilters}>Xóa bộ lọc</button>
      </div>
    </div>
  );
};

export default React.memo(FilterComponent);