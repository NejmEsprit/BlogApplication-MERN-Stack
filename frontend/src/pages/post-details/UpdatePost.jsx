import { useState, useEffect } from "react";
import "./updatePost.css"
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../../redux/apiCalls/postApiCall";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../redux/apiCalls/categoryApiCall";

const UpdatePost = ({ setUpdatePost, post }) => {

    const dispatch = useDispatch()
    const { categories } = useSelector(state => state.category)

    const [title, setTitle] = useState(post.title)
    const [description, setDescription] = useState(post.description)
    const [category, setCategory] = useState(post.category)

    const navigate = useNavigate()
    // Form Sumbit Handler
    const formSumbitHandler = (e) => {
        e.preventDefault();
        if (title.trim() === "") return toast.error("post title is required")
        if (category.trim() === "") return toast.error("post category is required")
        if (description.trim() === "") return toast.error("post description is required")

        dispatch(updatePost({ title, category, description }, post?._id));
        setUpdatePost(false);
        navigate(`/posts/details/${post?._id}`)
    }

    useEffect(() => {
        dispatch(fetchCategories)
    }, [])

    return (
        <div className="update-post">
            <form onSubmit={formSumbitHandler} className="update-post-form">
                <abbr title="close">
                    <i onClick={() => setUpdatePost(false)} className="bi bi-x-circle-fill update-post-from-close"></i>
                </abbr>
                <h1 className="update-post-title">Update Post</h1>
                <input
                    type="text"
                    className="update-post-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} />
                <select
                    className="update-post-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}>
                    <option disabled value="">
                        Select A Category
                    </option>
                    {categories.map(category =>
                        <option key={category._id} value={category.title}>
                            {category.title}
                        </option>)}
                </select>
                <textarea
                    className="update-post-textarea"
                    rows="5"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}></textarea>
                <button className="update-post-btn" type="sumbit">Update Post</button>
            </form>
        </div>
    );
}

export default UpdatePost;