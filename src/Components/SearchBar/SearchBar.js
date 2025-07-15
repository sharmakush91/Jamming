import "./SearchBar.css";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState("");
  function search(e) {
    e.preventDefault();
    onSearch(term);
  }

  function handleTermChange(e) {
    setTerm(e.target.value);
  }

  return (
    <form className="SearchBar" onSubmit={search}>
      <input
        placeholder="Enter A Song, Album, or Artist"
        onChange={handleTermChange}
        value={term}
      />
      <button className="SearchButton" type="submit">
        SEARCH
      </button>
    </form>
  );
}
