import { useNavigate } from "react-router-dom";

const useDeleteBlog = () => {
    const navigate = useNavigate();

    const deleteBlog = async (id, token) => {
        try {
            const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            if (res.status !== 200) {
                throw new Error(data.message || 'Ошибка при удалении');
            }

            alert('Blog successfully deleted');
            navigate('/');
        } catch (err) {
            console.error("Error deleting blog:", err);
        }
    };

    return { deleteBlog };
};

export default useDeleteBlog;
