import request from "../../utils/request"
import { toast } from "react-toastify"
import { postActions } from "../slices/posteSlice"

// Fetch Posts Bases On Page Number
export function fetchPosts(pageNumber) {
    return async (dispatch) => {
        try {
            const { data } = await request.get(`/api/posts?pageNumber=${pageNumber}`)
            dispatch(postActions.setPosts(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
// Fetch All Posts 
export function fetchAllPosts(pageNumber) {
    return async (dispatch) => {
        try {
            const { data } = await request.get(`/api/posts`)
            dispatch(postActions.setPosts(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
// get posts count
export function getPostsCount() {
    return async (dispatch) => {
        try {
            const { data } = await request.get(`/api/posts/count`)
            dispatch(postActions.setPostsCount(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
// Fetch Posts Bases On category
export function fetchPostsBasedOnCategory(category) {
    return async (dispatch) => {
        try {
            const { data } = await request.get(`/api/posts?category=${category}`)
            dispatch(postActions.setPostsCate(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
//Create post
export function createPost(newPost) {
    return async (dispatch, getState) => {
        try {
            dispatch(postActions.setLoadding())
            await request.post(`/api/posts`, newPost, {
                headers: {
                    Authorization: "bearer " + getState().auth.user.token,
                    "Content-Type": "multipart/from-data"
                }
            })

            dispatch(postActions.setIsPostCreated())
            setTimeout(() => dispatch(postActions.clearIsPostCreated()), 2000)
        } catch (error) {
            toast.error(error.response.data.message)
            dispatch(postActions.clearLoadding())
        }
    }
}
// Fetch Single Post By Id
export function fetchSinglePostById(postId) {
    return async (dispatch) => {
        try {
            const { data } = await request.get(`/api/posts/${postId}`);
            dispatch(postActions.setPost(data));
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
// toggle Like Post
export function toggleLikePost(postId) {
    return async (dispatch, getState) => {
        try {
            const { data } = await request.put(`/api/posts/like/${postId}`, {}, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user.token,
                }
            });
            dispatch(postActions.setPost(data));
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
// update Post Image
export function updatePostImage(newImage, postId) {
    return async (dispatch, getState) => {
        try {
            await request.put(`/api/posts/update-image/${postId}`, newImage, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user.token,
                    "Content-Type": "multipart/from-data",
                }
            });
            toast.success("new post image upoloaded successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
// Delete Post
export function deletePost(postId) {
    return async (dispatch,getState) => {
      try {
        const { data } = await request.delete(`/api/posts/${postId}`, {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          }
        });
        dispatch(postActions.deletePost(data.postId));
        toast.success(data.message);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
  }
  // Update Post
export function updatePost(newPost,postId) {
    return async (dispatch,getState) => {
      try {
        const { data } = await request.put(`/api/posts/${postId}`, newPost, {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          }
        });
        dispatch(postActions.setPost(data));
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
  }