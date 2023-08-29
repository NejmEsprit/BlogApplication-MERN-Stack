const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const { User, validateRegisterUser, validateLoginUser } = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");
const VerificationToken = require("../models/VerificationToken");
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail")

/**--------------------------
 desc : register New User
 router : /api/auth/register
 method :post
 access: Public KeyCredential
 ------------------------*/
//validation to data
module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
    //1.validation to data
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    //2.is user already exists
    let user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).json({ message: "user already exist" })
    }

    //3.hash tha password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //4.new user and save it to db
    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })
    await user.save()
    //5. verify email
    //5.1 creating new VerificationToken &save to DB
    const verificationToken = new VerificationToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
    });
    await verificationToken.save()
    //5.2 Making the Link 
    const link = `http://localhost:3000/users/${user._id}/verify/${verificationToken.token}`
    //5.3 Putting the link an html template
    const htmlTemplate = `
    <div>
        <p> Click on the link below to verify your email </p>
        <a href="${link}"> Verify </a>  
    </div>`
    //5.4 sending email ti the user
    await sendEmail(user.email, "verify Your Email", htmlTemplate)
    //6.send a response to client
    res.status(201).json({ message: " we send to tou an email ,please verify your email address " })

})

/**--------------------------
 desc : login User
 router : /api/auth/login
 method :post
 access: Public
 --------------------------*/
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
    //1.validation 
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    //2.is user exist 
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ message: "invalid email " })
    }
    //3. check the password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "invalid password " })
    }

    if (!user.isAccountVerified) {
        let verificationToken = await VerificationToken.findOne({
            userId: user._id,
        })
        if (!verificationToken) {
            verificationToken = new VerificationToken({
                userID: user._id,
                token: crypto.randomBytes(32).toString("hex")
            })
            await verificationToken.save()
        }
        const link = `http://localhost:3000/users/${user._id}/verify/${verificationToken.token}`
        
        const htmlTemplate = `
        <div>
            <p> Click on the link below to verify your email </p>
            <a href="${link}"> Verify </a>  
        </div>`
     
        await sendEmail(user.email, "verify Your Email", htmlTemplate)
        return res.status(400)
            .json({ message: " we send to tou an email ,please verify your email address " })
    }
   
    const token = user.generateAuthToken()

    //5. response to client 
    res.status(200).json({
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto,
        token
    })
})
/**--------------------------
 desc : verify User Account
 router : /api/auth/:userId/verify/:token
 method :GET
 access: Public
 --------------------------*/
module.exports.verifyUserAccountCtr = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        return res.status(400).json({ message: "invalid link" });
    }
    const verificationToken = await VerificationToken.findOne({
        userId: user._id,
        token: req.params.token,
    });
    if (!verificationToken) {
        return res.status(400).json({ message: "invalid link" });
    }
    user.isAccountVerified = true
    await user.save();

    // await verificationToken.remove();
    await verificationToken.deleteOne();

    res.status(200).json({ message: "your account verified" })
})
