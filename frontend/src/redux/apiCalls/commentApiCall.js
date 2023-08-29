import { postActions } from "../slices/posteSlice"
import request from "../../utils/request"
import { toast } from "react-toastify"
import { commentActions } from "../slices/commentSlice"

//Create Comment
export function createComment(newComment) {
    return async (dispatch, getState) => {
        try {
            const { data } = await request.post("/api/comments", newComment, {
                headers: {
                    Authorization: "Barear " + getState().auth.user.token,
                }
            })
            dispatch(postActions.addCommentToPost(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

//Update Comment
export function updateComment(commentId, comment) {
    return async (dispatch, getState) => {
        try {
            const { data } = await request.put(`/api/comments/${commentId}`, comment, {
                headers: {
                    Authorization: "Barear " + getState().auth.user.token,
                }
            })
            dispatch(postActions.updateCommentPost(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}

//delete Comment
export function deleteComment(commentId) {
    return async (dispatch, getState) => {
        try {
            await request.delete(`/api/comments/${commentId}`, {
                headers: {
                    Authorization: "Barear " + getState().auth.user.token,
                }
            })
            dispatch(commentActions.deleteComment(commentId))
          //  dispatch(postActions.deleteCommentFormPost(commentId))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
//delete Comment
export function deleteCommentPost(commentId) {
    return async (dispatch, getState) => {
        try {
            await request.delete(`/api/comments/${commentId}`, {
                headers: {
                    Authorization: "Barear " + getState().auth.user.token,
                }
            })
          //  dispatch(commentActions.deleteComment(commentId))
           dispatch(postActions.deleteCommentFormPost(commentId))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}


//fetch all Comments
export function fetchAllComment(commentId) {
    return async (dispatch, getState) => {
        try {
            const { data } = await request.get(`/api/comments`, {
                headers: {
                    Authorization: "Barear " + getState().auth.user.token,
                }
            })

            dispatch(commentActions.setComments(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
