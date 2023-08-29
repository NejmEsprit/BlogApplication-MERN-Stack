import { useState } from "react";
import { toast } from "react-toastify";
import "./form.css"
import {useDispatch}from "react-redux"
import { forgaotPassword } from "../../redux/apiCalls/passwordApiCall";

const ForgotPassword = () => {
    const dispatch =useDispatch()
    const [email, setEmail] = useState("")

    const SubmitHandeler = (e) => {
        e.preventDefault()
        if (email.trim() === '') return toast.error("email is required")
        dispatch(forgaotPassword(email))
    }
    return (
        <section className="form-container">
            <h1 className="form-title"> Forgaot Password </h1>
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
                <button className="form-btn" type="submit"> Submit</button>
            </form>

        </section>
    );
}

export default ForgotPassword;
