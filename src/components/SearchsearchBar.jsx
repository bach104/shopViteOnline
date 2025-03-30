import { useState } from "react";

const Search = ({ onResults }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onResults(query.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="p-4 flex max-width bg__header justify-center w-full">
      <input
        id="search-input"
        name="search"
        className="w-5/6 p-3 relative rounded-sm"
        type="text"
        placeholder="Nhập từ khóa cần tìm kiếm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="on"
      />
      <button
        className="bg-black hover:opacity-80 text-white px-4 py-2 ml-2"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
