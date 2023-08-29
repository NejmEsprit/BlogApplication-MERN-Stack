import { Link } from "react-router-dom";
import AddCategoryForm from "./AddCategoryForm";
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import { fetchCategories } from "../../redux/apiCalls/categoryApiCall";
import { getUsersCount } from "../../redux/apiCalls/profileApiCall";
import { getPostsCount } from "../../redux/apiCalls/postApiCall";
import { fetchAllComment } from "../../redux/apiCalls/commentApiCall";

const AdminMain = () => {
    const dispatch = useDispatch()
    const { categories  } = useSelector(state => state.category)
    const { usersCount } = useSelector(state => state.profile);
    const { postsCount } = useSelector(state => state.post);
    const { comments } = useSelector(state => state.comment);

    useEffect(() => {
        dispatch(fetchCategories())
        dispatch(getUsersCount())
        dispatch(getPostsCount())
        dispatch(fetchAllComment())
    }, [])
    return (
        <div className="admin-main">
            <div className="admin-main-header">
                <div className="admin-main-card">
                    <h5 className="admin-card-tilte">Users</h5>
                    <div className="admin-card-count">
                        {usersCount}
                    </div>
                    <div className="admin-card-links-wrapper">
                        <Link
                            to="/admin-dashboard/users-table"
                            className="admin-card-link">
                            See All Users
                        </Link>
                        <div className="admin-card-icon">
                            <i className="bi bi-person"></i>
                        </div>
                    </div>
                </div>

                <div className="admin-main-card">
                    <h5 className="admin-card-tilte">Posts</h5>
                    <div className="admin-card-count">{postsCount}</div>
                    <div className="admin-card-links-wrapper">
                        <Link to="/admin-dashboard/posts-table"
                            className="admin-card-link">
                            See All Posts
                        </Link>
                        <div className="admin-card-icon">
                            <i className="bi bi-file-post"></i>
                        </div>
                    </div>
                </div>

                <div className="admin-main-card">
                    <h5 className="admin-card-tilte">categories</h5>
                    <div className="admin-card-count">
                        {
                            categories.length
                        }
                    </div>
                    <div className="admin-card-links-wrapper">
                        <Link to="/admin-dashboard/categories-table"
                            className="admin-card-link">
                            See All categories
                        </Link>
                        <div className="admin-card-icon">
                            <i className="bi bi-tag-fill"></i>
                        </div>
                    </div>
                </div>

                <div className="admin-main-card">
                    <h5 className="admin-card-tilte">Comments</h5>
                    <div className="admin-card-count">{comments.length}</div>
                    <div className="admin-card-links-wrapper">
                        <Link to="/admin-dashboard/comments-table"
                            className="admin-card-link">
                            See All Comments
                        </Link>
                        <div className="admin-card-icon">
                            <i className="bi bi-chat-left-text"></i>
                        </div>
                    </div>
                </div>
            </div>
            <AddCategoryForm />
        </div>
    );
}

export default AdminMain;