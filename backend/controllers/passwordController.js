const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const { User, validateEmail, validateNewPassword } = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")

/**--------------------------
 desc : send Reset Password Link
 router : /api/passsword/reset-password-link
 method : POST
 access: Public
 ------------------------*/
module.exports.sendResetPasswordLinkCtrl = asyncHandler(async (req, res) => {
    // 1.validation
    const { error } = validateEmail(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    // 2.get the user from DB by email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).json({ message: "User with given email does not exist!!!" })
    }
    // 3.creating VerificationToken
    let verificationToken = await VerificationToken.findOne({ userId: user._id })
    if (!verificationToken) {
        verificationToken = new VerificationToken({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        })
        await verificationToken.save()
    }
    // 4.creating Link
    const link = `http://localhost:3000/reset-password/${user._id}/${verificationToken.token}`;
    // 5.creating HTML template
    const htmlTemplate = `<a href ="${link}"> Click here to reset your password </a>`;
    // 6.sending Email
    await sendEmail(user.email, "Reset Password", htmlTemplate)
    // 7.response to the client
    res.status(200).json({ message: "Passowrd reset link send to your email ,Please check your inbox" })

})

/**--------------------------
 desc : Get Reset Password Link
 router : /api/passsword/reset-password/:userId/:token
 method : GET
 access: Public
 ------------------------*/
module.exports.getResetPasswordCtrl = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return res.status(400).json({ message: "invalid link" })
    }
    const verificationToken = await VerificationToken.findOne({
        userId: user._id,
        token: req.params.token
    })
    if (!verificationToken) {
        return res.status(400).json({ message: "invalid link" })
    }
    res.status(200).json({ message: "Valid link" })
})

/**--------------------------
 desc :  Reset Password Link
 router : /api/passsword/reset-password/:userId/:token
 method : GET
 access: Public
 ------------------------*/
module.exports.resetPassowrdCtrl = asyncHandler(async (req, res) => {
    const { error } = validateNewPassword(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const user = await User.findById(req.params.userId)
    if (!user) {
        return res.status(400).json({ message: "invalid Linkbbbb " })
    }

    const verificationToken = await VerificationToken.findOne({
        userId: user._id,
        token: req.params.token,
    });
    if (!verificationToken) {
        return res.status(400).json({ message: "invalid link aaaa" });
    }
    if (!user.isAccountVerified) {
        user.isAccountVerified = true;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;
    await user.save();
    await verificationToken.deleteOne();

    res.status(200).json({ message: "Password reset successfully, please log in" });
});