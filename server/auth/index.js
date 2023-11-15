const jwt = require("jsonwebtoken")
JWT_SECRET="ef77aaa1c3b4cb3c5db435e64d3d7cc87b1280efff077abf2b3ad738cbbad5d5"

function authManager() {
    verify = (req, res, next) => {
        console.log("req: " + req);
        console.log("next: " + next);
        console.log("Who called verify?");
        try {
            const token = req.cookies.token;
            if (!token) {
                next();
            } else {
                const verified = jwt.verify(token, JWT_SECRET)
                console.log("verified.userId: " + verified.userId);
                req.userId = verified.userId;

                next();
            }
        } catch (err) {
            console.error(err);
            return res.status(401).json({
                loggedIn: false,
                user: null,
                errorMessage: "Unauthorized"
            });
        }
    }

    verifyUser = (req) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return null;
            }

            const decodedToken = jwt.verify(token, JWT_SECRET);
            return decodedToken.userId;
        } catch (err) {
            return null;
        }
    }

    signToken = (userId) => {
        return jwt.sign({
            userId: userId
        }, JWT_SECRET);
    }

    return this;
}

const auth = authManager();
module.exports = auth;