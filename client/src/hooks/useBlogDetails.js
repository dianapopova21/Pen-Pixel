import { useEffect, useState } from "react";

const useBlogDetails = (id, user) => {
    const [blog, setBlog] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
                const data = await res.json();
                setBlog(data);

                if (user) {
                    const favRes = await fetch(`http://localhost:5000/api/favorites?userId=${user.id}`);
                    const favData = await favRes.json();
                    setIsFavorite(favData.some(b => b.blog_id === parseInt(id)));
                } else {
                    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
                    setIsFavorite(stored.includes(id));
                }
            } catch (err) {
                console.error("Error loading blog:", err);
            }
        };

        fetchBlog();
    }, [id, user]);

    return { blog, isFavorite, setIsFavorite };
};

export default useBlogDetails;
