import { authActions } from "../slices/authSlice"
import request from "../../utils/request"
import { toast } from "react-toastify"


//login User
export function loginUser(user) {
    return async (dispatch) => {
        try {
            // remplacer par axios
            // const response = await fetch("http://localhost:8000/api/auth/login", {
            //     method: "POST",
            //     body: JSON.stringify(user),
            //     headers: {
            //         "Content-Type": "application/json"
            //     }
            // })
            // const data = await response.json()
            const { data } = await request.post("/api/auth/login", user)
            dispatch(authActions.login(data))
            localStorage.setItem("userInfo", JSON.stringify(data))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
//logout user
export function logoutUser() {
    return (dispatch) => {
        dispatch(authActions.logout())
        localStorage.removeItem("userInfo")
    }
}
// register User
export function registerUser(user) {
    return async (dispatch) => {
        try {
            const { data } = await request.post("/api/auth/register", user)
            dispatch(authActions.register(data.message))
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
// verify Email
export function verifyEmail(userId, token) {
    return async (dispatch) => {
        try {
             await request.get(`/api/auth/${userId}/verify/${token}`)
            dispatch(authActions.setIsEmailVerified())
        } catch (error) {
            console.log(error)


        }
    }
}
