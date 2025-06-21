import { useEffect, useState } from 'react';

const useSearchBlogs = (query) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            if (!query.trim()) return;

            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`http://localhost:5000/api/blogs/search?query=${encodeURIComponent(query)}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || 'Error while receiving data');
                }

                setBlogs(data);
                setNotFound(data.length === 0);
            } catch (err) {
                console.error('Error while searching blogs:', err);
                setError(err.message);
                setBlogs([]);
                setNotFound(false);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [query]);

    return { blogs, loading, notFound, error };
};

export default useSearchBlogs;
