import { useState, useEffect } from "react";
import "./createPost.css"
import { toast } from "react-toastify"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createPost } from "../../redux/apiCalls/postApiCall";
import { RotatingLines } from "react-loader-spinner"
import { fetchCategories } from "../../redux/apiCalls/categoryApiCall";

const CreatePost = () => {

    const dispatch = useDispatch()
    const { loading, isPostCreated } = useSelector(state => state.post)
    const { categories } = useSelector(state => state.category)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [file, setfile] = useState(null)
    //Form sumbit handler
    const formSumbitHandler = (e) => {
        e.preventDefault();
        if (title.trim() === "") return toast.error("post title is required")
        if (category.trim() === "") return toast.error("post category is required")
        if (description.trim() === "") return toast.error("post description is required")
        if (!file) return toast.error("post file is required")

        const formData = new FormData()
        formData.append("image", file)
        formData.append("title", title)
        formData.append("category", category)
        formData.append("description", description)

        dispatch(createPost(formData))
    }
    const navigate = useNavigate()
    useEffect(() => {
        if (isPostCreated) {
            navigate("/")
        }
    }, [isPostCreated, navigate])
    useEffect(() => {
        dispatch(fetchCategories())
    }, [])

    return (
        <h1>
            <section className="section create-post">
                <h1 className="create-post-title">
                    Create New Post
                </h1>
                <form
                    onSubmit={formSumbitHandler}
                    className="create-post-form">
                    <input
                        className="create-post-input"
                        type="text"
                        placeholder="Post Tiltle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                    <select
                        className="create-post-input"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        <option value="">
                            Select à Category
                        </option>
                        {categories.map(category =>
                            <option key={category._id} value={category.title}>
                                {category.title}
                            </option>)}

                    </select>
                    <textarea
                        className="craete-post-textarea"
                        rows="5"
                        placeholder="Post Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}></textarea>
                    <input
                        type="file"
                        name="file" id="file"
                        className="create-post-upload"
                        onChange={(e) => setfile(e.target.files[0])} />
                    <button type="submit" className="create-form-btn">
                        {
                            loading ? (<RotatingLines
                                strokeColor="grey"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="40"
                                visible={true}
                            />) : "Create"
                        }
                    </button>
                </form>
            </section>
        </h1>
    );
}

export default CreatePost;