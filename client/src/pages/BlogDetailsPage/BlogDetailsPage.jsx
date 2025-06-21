import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useDeleteBlog from "../../hooks/useDeleteBlog";
import useBlogDetails from "../../hooks/useBlogDetails";
import BlogInfo from "../../components/BlogInfo/BlogInfo";


const BlogDetailsPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { deleteBlog } = useDeleteBlog();
    const { blog, isFavorite, setIsFavorite } = useBlogDetails(id, user);

    const toggleFavorite = async () => {
        if (user) {
            try {
                const method = isFavorite ? "DELETE" : "POST";
                await fetch("http://localhost:5000/api/favorites", {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId: user.id, blogId: parseInt(id) }),
                });
            } catch (err) {
                console.error("Error updating favorites:", err);
            }
        } else {
            const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
            const updated = isFavorite
                ? stored.filter(favId => favId !== id)
                : [...stored, id];
            localStorage.setItem("favorites", JSON.stringify(updated));
        }

        setIsFavorite(!isFavorite);
    };

    const handleDelete = () => {
        if (!user || !user.id) {
            alert('You must be logged in.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Token not found');
            return;
        }

        deleteBlog(id, token);
        navigate("/");
    };

    if (!blog) return <div className="blog-loading">Загрузка...</div>;

    return (
        <BlogInfo
            blog={blog}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onDelete={handleDelete}
            isOwner={user && blog.author_id === user.id}
        />
    );
};

export default BlogDetailsPage;
