import "./form.css"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getResetPassword, resetPassword } from "../../redux/apiCalls/passwordApiCall";
const ResetPassword = () => {
    const dispatch = useDispatch()
    const { isError } = useSelector(state => state.password)

    const [password, setPassword] = useState("")
    const { userId, token } = useParams()
    const [passwordShown, setPasswordShown] = useState(false);

    useEffect(() => {
        dispatch(getResetPassword(userId, token));
    }, [userId, token])

    const SubmitHandeler = (e) => {
        e.preventDefault()
        if (password.trim() === "") return toast.error("password is required")
        dispatch(resetPassword(password, { userId, token }))
    }
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <section className="form-container">
            {isError ? <h1> Not Found</h1> :
                <>
                    <h1 className="form-title"> Reset Password </h1>
                    <form onSubmit={SubmitHandeler} className="form">
                        <div className="form-group">
                            <lable htmlFor="username" className="form-label">
                                Password
                            </lable>
                            <input
                                type={passwordShown ? "text" : "password"}
                                className="form-input"
                                id="passowrd"
                                placeholder="Enter your new passowrd"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="container-show-password">
                            <input className="show-password" id="check" type="checkbox" onClick={togglePassword} />
                            show password
                        </div>
                        <button className="form-btn" type="submit"> Submit</button>
                    </form>
                </>}


        </section>
    );
}

export default ResetPassword;