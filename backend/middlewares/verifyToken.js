const jwt = require("jsonwebtoken")

//verify Token 
function verifyToken(req, res, next) {
    const authToken = req.headers.authorization
    if (authToken) {
        const token = authToken.split(" ")[1]
        try {
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decodedPayload
            next()

        } catch (error) {
            return res.status(401).json({ message: " invalid token ,acces denied" })

        }
    }
    else {
        return res.status(401).json({ message: " no token provided ,acces denied" })
    }
}
//verify Token & admin 
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        }
        else {
            return res.status(403).json({ message: "not allowed, only admin" })
        }
    })
}
//verify Token & only user himself 
function verifyTokenAndOnlyUser(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next()
        }
        else {
            return res.status(403).json({ message: "not allowed, only admin" })
        }
    })
}
//verify Token & Autorization 
function verifyTokenAndAutorization(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        }
        else {
            return res.status(403).json({ message: "not allowed, only user himself or admin" })
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyTokenAndAutorization
}