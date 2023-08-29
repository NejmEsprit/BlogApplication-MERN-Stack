import { passwordActions } from "../slices/passwordSlice"
import request from "../../utils/request"
import { toast } from "react-toastify"


//forgot password
export function forgaotPassword(email) {
    return async () => {
        try {
            const { data } = await request.post("/api/password/reset-password-link", { email })
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}
//Get resret password
export function getResetPassword(userId, token) {
    return async (dispatch) => {
        try {
            await request.get(`/api/password/reset-password/${userId}/${token}`)
        } catch (error) {
            console.log(error)
            dispatch(passwordActions.setError())
        }
    }
}
// resret the password
export function resetPassword(newPassword, user) {
    return async () => {
        try {
            const { data } = await request.post(`/api/password/reset-password/${user.userId}/${user.token}`, {
                password: newPassword,
            })
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}