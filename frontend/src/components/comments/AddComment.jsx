import "./addComment.css"
import { useState } from "react"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { createComment } from "../../redux/apiCalls/commentApiCall"
const AddComment = ({postId}) => {

    const dispatch =useDispatch()
    const [text, setText] = useState("");
    //Forum sumbit handler
    const formSumbitHandler = (e) => {
        e.preventDefault();
        if (text.trim() === "") return toast.error("please writre something")
        console.log({ text })
        dispatch(createComment({text ,postId}))
        setText("")
    }
    return (
        <form onSubmit={formSumbitHandler} className="add-comment">
            <input
                type="text"
                className="add-comment-input"
                placeholder="Add a comment"
                value={text}
                onChange={(e) => setText(e.target.value)} />
            <button type="sumbit" className="add-comment-btn">
                comment
            </button>
        </form>
    );
}

export default AddComment;