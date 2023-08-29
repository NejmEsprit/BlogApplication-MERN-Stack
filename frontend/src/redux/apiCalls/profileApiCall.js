import request from "../../utils/request"
import { toast } from "react-toastify"
import { profileActions } from "../slices/profileSlice"
import { authActions } from "../slices/authSlice"


//Get User Profile
export function getUserProfile(userId) {
    return async (dispatch) => {
        try {
            const { data } = await request.get(`/api/users/profile/${userId}`)
            dispatch(profileActions.setProfile(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
//Upload Profile Photo
export function uploadProfilePhoto(newPhoto) {
    return async (dispatch, getState) => {
        try {
            const { data } = await request.post(`/api/users/profile/profile-photo-upload`, newPhoto, {
                headers: {
                    Authorization: "Bearer " + getState().auth.user.token,
                    "content-Type ": "multipart/from-data"
                }
            }
            )
            dispatch(profileActions.setProfilePhoto(data.profilePhoto))
            dispatch(authActions.setUserPhoto(data.profilePhoto))
            toast.success(data.message)
            //modify the user in local storage with new photo
            const user = JSON.parse(localStorage.getItem("userInfo"))
            user.profilePhoto = data?.profilePhoto
            localStorage.setItem("userInfo", JSON.stringify(user))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
//update profile 
export function updateProfile(userId, profile) {
    return async (dispatch, getState) => {
        try {
            const { data } = await request.put(`/api/users/profile/${userId}`, profile,
                {
                    headers: {
                        Authorization: "Bearer " + getState().auth.user.token,
                    }
                }
            )
            dispatch(profileActions.updateProfile(data))
            dispatch(authActions.setUsername(data.username))
            //modify the user in local storage with new username
            const user = JSON.parse(localStorage.getItem("userInfo"))
            user.username = data?.username
            localStorage.setItem("userInfo", JSON.stringify(user))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
//delete profile (Account)
export function deleteProfile(userId) {
    return async (dispatch, getState) => {
        try {
            dispatch(profileActions.setLoading)
            const { data } = await request.delete(`/api/users/profile/${userId}`,
                {
                    headers: {
                        Authorization: "Bearer " + getState().auth.user.token,
                    }
                }
            )
            dispatch(profileActions.setIsProfileDeleted())
            toast.success(data.message)
            setTimeout(() => (profileActions.clearIsProfileDeleted()), 2000)
        } catch (error) {
            toast.error(error.response.data.message)
            dispatch(profileActions.clearLoading())
        }
    }
}
//get User Count
export function getUsersCount() {
    return async (dispatch, getState) => {
        try {
          const { data } = await request.get(
            `/api/users/count`,
            {
              headers: {
                Authorization: "Bearer " + getState().auth.user.token,
              },
            }
          );
    
          dispatch(profileActions.setUserCount(data));
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };
}
//get All User Profile
export function getAllUserProfile() {
    return async (dispatch, getState) => {
        try {
            const { data } = await request.get(
                `/api/users/profile`,
                {
                    headers: {
                        Authorization: "Bearer " + getState().auth.user.token,
                    },
                }
            );

            dispatch(profileActions.setProfiles(data));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };
}


