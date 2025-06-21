import React from 'react';
import { useLocation } from 'react-router-dom';
import useSearchBlogs from '../../hooks/useSearchBlogs';
import BlogGrid from "../../components/BlogGrid/BlogGrid";
import "./SearchResultsPage.scss";
import sadFace from "../../assets/sad-face.png";


const SearchResultsPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';

    const { blogs, loading, notFound, error } = useSearchBlogs(query);

    return (
        <div>
            <h2 className="search_results_title">Search results for: "{query}"</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="error_message">Error: {error}</p>}
            {notFound &&
                <div className="not-found">
                <h1>Not found</h1>
                <img src={sadFace} alt="sad emoji" className="not-found__emoji" />
            </div>
            }

            <div className="search-results-list">
                <BlogGrid blogs={blogs} />
            </div>
        </div>
    );
};

export default SearchResultsPage;
