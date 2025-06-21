import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import "./SearchBar.scss";

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <div className="search-bar__input-wrapper">
                <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-bar__input"
                />
                <button
                    type="submit"
                    className="search-bar__icon-button"
                    aria-label="Search"
                >
                    <CiSearch className="search-bar__icon" />
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
