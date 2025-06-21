import { useState, useMemo } from "react";

const usePaginatedBlogs = (blogs, blogsPerPage = 6) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(blogs.length / blogsPerPage);

    const currentBlogs = useMemo(() => {
        const start = (currentPage - 1) * blogsPerPage;
        const end = start + blogsPerPage;
        return blogs.slice(start, end);
    }, [blogs, currentPage, blogsPerPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return {
        currentBlogs,
        currentPage,
        totalPages,
        goToPage,
    };
};

export default usePaginatedBlogs;
