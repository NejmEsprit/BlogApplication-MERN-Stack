import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import "./postDetails.css"
import { toast } from "react-toastify"
import AddComment from "../../components/comments/AddComment"
import CommentList from "../../components/comments/CommentList"
import swal from "sweetalert"
import UpdatePost from "./UpdatePost"
import { useDispatch, useSelector } from "react-redux"
import { deletePost, fetchSinglePostById, toggleLikePost, updatePostImage } from "../../redux/apiCalls/postApiCall"
import { useNavigate } from "react-router-dom"
const PostDetails = () => {

    const dispach = useDispatch()
    const { post } = useSelector(state => state.post)
    const { user } = useSelector(state => state.auth)

    const { id } = useParams()

    const [file, setFile] = useState(null)
    const [updatePost, setUpdatePost] = useState(false)
    useEffect(() => {
        window.scrollTo(0, 0)
        dispach(fetchSinglePostById(id))
    }, [id])
    //update Image sumbit handler
    const updateImageSumbitHundler = (e) => {
        e.preventDefault();
        if (!file) {
            return toast.warning("there is no file !!!");
        }
        const formData = new FormData();
        formData.append("image", file);
        dispach(updatePostImage(formData, post?._id));
    }
    const navigate = useNavigate()
    //delete post Handler
    const deletePostHandler = () => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this post!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((isOk) => {
                if (isOk) {
                    dispach(deletePost(post?._id))
                    navigate(`/profile/${user?._id}`)
                }
            });
    }
    return (
        <section className="post-details">

            <div className="post-datails-image-wrapper">
                <img
                    src={file ? URL.createObjectURL(file) : post?.image.url}
                    alt=""
                    className="post-details-image"
                />

                {user?._id === post?.user?._id && (
                    <form
                        onSubmit={updateImageSumbitHundler}
                        className="update-post-image-form"
                    >
                        <label htmlFor="file" className="update-post-label">
                            <i className="bi bi-image-fill"></i>
                            select new image
                        </label>
                        <input
                            style={{ display: 'none' }}
                            type="file"
                            name="file"
                            id="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                        <button type="sumbit">upload </button>
                    </form>
                )}
            </div>
            <h1 className="post-details-title">{post?.title}</h1>
            <div className="post-datail-user-info">
                <img src={post?.user.profilePhoto?.url} alt="" className="post-details-user-image" />
                <div className="post-deatails-user">
                    <strong>
                        <Link to={`/profile/${post?.user._id}`}>{post?.user.username}</Link>
                    </strong>
                    <span>{new Date(post?.createdAt).toDateString()}</span>
                </div>
            </div>
            <p className="post-details-description">
                {post?.description} Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Nam, placeat accusamus, fugiat illo accusantium,
                explicabo tempora necessitatibus voluptatum tempore praesentium odio quisquam pariatur?
                Laudantium mollitia eos quis laborum officia doloribus!
            </p>
            <div className="post-details-icon-wrapper">
                <div>
                    {
                        user && (
                            <i
                                onClick={() => dispach(toggleLikePost(post?._id))}
                                className={
                                    post?.likes.includes(user?._id)
                                        ? "bi bi-hand-thumbs-up-fill"
                                        : "bi bi-hand-thumbs-up"
                                }></i>
                        )
                    }
                    <small>{post?.likes.length} Likes</small>
                </div>
                {user?._id === post?.user?._id && (<div>
                    <i onClick={() => setUpdatePost(true)} className="bi bi-pencil-square"></i>
                    <i
                        className="bi bi-trash-fill"
                        onClick={deletePostHandler}></i>
                </div>
                )}

            </div>
            {
                user? <AddComment postId={post?._id} />:
                <p className="post-details-info-write">
                    to write a comment you should login first
                </p>

            }
            
            <CommentList comments={post?.comments} />
            {updatePost && <UpdatePost post={post} setUpdatePost={setUpdatePost} />}
        </section>
    );
}

export default PostDetails;