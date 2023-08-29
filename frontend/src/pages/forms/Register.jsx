import { Link, useNavigate } from "react-router-dom";
import "./form.css"
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "../../redux/apiCalls/authApiCall";
import swal from "sweetalert";

const Register = () => {
    const dispatch = useDispatch()
    const { registerMessage } = useSelector(state => state.auth)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordShown, setPasswordShown] = useState(false);

    //form submit Handler
    const SubmitHandeler = (e) => {
        e.preventDefault()
        if (username.trim() === '') return toast.error("username is required")
        if (email.trim() === '') return toast.error("email is required")
        if (password.trim() === '') return toast.error("password is required")
        //  console.log({ username, email, password })
        dispatch(registerUser({ username, email, password }))
    }
    const navigate = useNavigate()
    if (registerMessage) {
        swal({
            title: registerMessage,
            icon: "success"
        }).then(isOk => {
            if (isOk) {
                navigate("/")
            }
        })
    }
    const togglePassword = () => {
        // When the handler is invoked
        // inverse the boolean state of passwordShown
        setPasswordShown(!passwordShown);
    };
    return (
        <section className="form-container">
            <h1 className="form-title"> Create new account</h1>
            <form onSubmit={SubmitHandeler} className="form">
                <div className="form-group">
                    <lable htmlFor="username" className="form-label">
                        Username
                    </lable>
                    <input
                        type="text"
                        className="form-input"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <lable htmlFor="username" className="form-label">
                        Email
                    </lable>
                    <input
                        type="Email"
                        className="form-input"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type={passwordShown ? "text" : "password"}
                        className="form-input"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="container-show-password">
                    <input className="show-password" id="check" type="checkbox" onClick={togglePassword} />
                    show password
                </div>
                <button className="form-btn" type="submit"> Register</button>
            </form>
            <div className="form-footer">
                Already have an acoount? <Link to="/login">Login</Link>
            </div>
        </section>
    );
}

export default Register;