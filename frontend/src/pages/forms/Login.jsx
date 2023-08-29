import { Link } from "react-router-dom";
import "./form.css"
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux"
import { loginUser } from "../../redux/apiCalls/authApiCall";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordShown, setPasswordShown] = useState(false);

    const dispatch = useDispatch()

    //form submit Handler
    const SubmitHandeler = (e) => {
        e.preventDefault()
        if (email.trim() === '') return toast.error("email is required")
        if (password.trim() === '') return toast.error("password is required")
        // console.log({ email, password })
        dispatch(loginUser({ email, password }))
    }

    const togglePassword = () => {
        // When the handler is invoked
        // inverse the boolean state of passwordShown
        setPasswordShown(!passwordShown);
    };

    return (
        <section className="form-container">
            <h1 className="form-title"> Log In to your account </h1>
            <form onSubmit={SubmitHandeler} className="form">
                <div className="form-group">
                    <lable htmlFor="username" className="form-label">
                        Email
                    </lable>
                    <input
                        type="Email"
                        className="form-input"
                        id="username"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        Passowrd
                    </label>
                    <input
                        type={passwordShown ? "text" : "password"}
                        className="form-input"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="container-show-password">
                        <input className="show-password" id="check" type="checkbox" onClick={togglePassword} />
                        show password
                    </div>
                    {/* <button onClick={togglePassword}>Show Password</button> */}
                </div>
                <button className="form-btn" type="submit"> Log In</button>
            </form>
            <div className="form-footer">
                Did you forgot password?
                <Link to="/forgot-password"> Forgot password</Link>
            </div>
        </section>
    );
}

export default Login;