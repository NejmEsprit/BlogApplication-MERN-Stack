import { useState } from "react";
import "./commentList.css"
import swal from "sweetalert";
import UpdateCommentModal from "./UpdateCommentModal";
import Moment from "react-moment"
import { useSelector, useDispatch } from "react-redux";
import { deleteCommentPost } from "../../redux/apiCalls/commentApiCall";

const CommentList = ({ comments }) => {
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.auth)

    const [updateComment, setUpdateComment] = useState(false)
    const [commentForUpdate, SetCommentForUpdate] = useState(null)

    //Update Comment Handler
    const updateCommentHandler = (comment) => {
        SetCommentForUpdate(comment)
        setUpdateComment(true)
    }

    // Delete Comment Handler
    const deleteCommentHandler = (commentId) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this comment !",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((isOk) => {
                if (isOk) {
                    dispatch(deleteCommentPost(commentId))
                }
            });
    }

    return (
        <div className="comment-list">
            <h4 className="comment-list-count">{comments?.length} Comments</h4>
            {comments?.map(comment => (
                <div key={comment._id} className="comment-item">
                    <div className="comment-item-info">
                        <div className="comment-item username">
                            {comment.username}
                        </div>
                        <div className="comment-item-time">
                            <Moment fromNow ago>
                                {comment.createdAt}
                            </Moment>{" "} ago
                        </div>
                    </div>
                    <p className="comment-item-text">
                        {comment.text}
                    </p>
                    {
                        user?._id === comment.user && (<div className="comment-item-icon-wrapper">
                            <i
                                className="bi bi-pencil-square"
                                onClick={() => updateCommentHandler(comment)}>

                            </i>
                            <i
                                className="bi bi-trash-fill"
                                onClick={() => deleteCommentHandler(comment?._id)}>

                            </i>
                        </div>
                        )
                    }
                </div>
            ))}
            {updateComment && (
                <UpdateCommentModal
                    commentForUpdate={commentForUpdate}
                    setUpdateComment={setUpdateComment} />)}
        </div>
    );
}

export default CommentList;