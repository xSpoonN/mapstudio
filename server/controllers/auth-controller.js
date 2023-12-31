const auth = require('../auth')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { DefaultAzureCredential } = require('@azure/identity');
const { BlobServiceClient } = require("@azure/storage-blob");

const blobServiceClient = new BlobServiceClient(`https://mapstudio.blob.core.windows.net`, new DefaultAzureCredential() );

getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            })
        }

        const loggedInUser = await User.findOne({ _id: userId });
        console.log("loggedInUser: " + loggedInUser);

        return res.status(200).json({
            loggedIn: true,
            user: {
                username: loggedInUser.username,
                email: loggedInUser.email
            }
        })
    } catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
}

loginUser = async (req, res) => {
    console.log("loginUser");
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ username: username });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong username or password provided."
                })
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong username or password provided."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                username: existingUser.username,  
                email: existingUser.email              
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
}

registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("create user: " + username + " " + email + " " + password);
        if (!username || !email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("all fields provided");
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        console.log("password long enough");
        const existingUser = await User.findOne({ username: username });
        console.log("existingUser: " + existingUser);
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        }
        const existingUser2 = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser2);
        if (existingUser2) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        const newUser = new User({
            username, email, passwordHash
        });
        const savedUser = await newUser.save();
        console.log("new user saved: " + savedUser._id);

        // LOGIN THE USER
        const token = auth.signToken(savedUser._id);
        console.log("token:" + token);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                username: savedUser.username,
                email: savedUser.email              
            }
        })

        console.log("token sent");

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

forgotPassword = async (req, res) => {
    try {
        const { email, username } = req.body;
        console.log("forgot password: " + email + " " + username);
        if (!email || !username) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("all fields provided");
        const existingUser = await User.findOne({ username: username, email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username does not exist."
                })
        }
        if (existingUser.email !== email) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "The email provided does not match the username."
                })
        }
        const resetToken = crypto.randomBytes(4).toString('hex');
        const resetPasswordToken = await bcrypt.hash(resetToken, 10);

        existingUser.resetPasswordToken = resetPasswordToken;
        existingUser.resetPasswordExpires = Date.now() + 10*60*1000; // 10 minutes
        await existingUser.save();
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'mapstudio.cse416@gmail.com',
                pass: 'oyat swph tqry qxtl',
                clientId: '869790817840-dr6nvnf91281qpeq8jqgtfecpugm0suv.apps.googleusercontent.com',
                clientSecret: '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',
                refreshToken: '1//04WI8eRlvQgCSCgYIARAAGAQSNwF-L9IrS_Y6TE2J1KrnHZAsAJaKM8xTlyro_OS2LKDoJPmDEDwqMneTrmHBP0d7d8vSMoucxt8'
            }
        });
        let message = {
            from: 'mapstudio.cse416@gmail.com',
            to: email,
            subject: 'MapStudio Password Reset',
            text: 'Your password reset code is: ' + resetToken
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });

        res.json({ success: true, message: "Email sent " + resetToken });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

verifyResetToken = async (req, res) => {
    try {
        const { email, token } = req.body;
        if (!token) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("verify reset token: " + token);
        console.log("all fields provided");
        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Invalid user."
                })
        }
        const passwordCorrect = await bcrypt.compare(token, existingUser.resetPasswordToken);
        if (!passwordCorrect) {
            console.log("Incorrect code");
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong auth code."
                })
        }
        if (existingUser.resetPasswordExpires < Date.now()) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Token expired."
                })
        }
        res.json({ success: true, message: "Token verified." });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("reset password: " + email + " " + password);
        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("all fields provided");
        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Invalid user."
                })
        }
        if (existingUser.tokenExpires < Date.now()) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Token expired."
                })
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        existingUser.passwordHash = passwordHash;
        existingUser.tokenExpires = Date.now();
        await existingUser.save();
        res.json({ success: true, message: "Password reset." });    
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

setProfilePicture = async (req, res) => {
    try {
        const containerClient = blobServiceClient.getContainerClient('images');

        // Get existing image URL if any
        const user = await User.findOne({ email: req.params.email });
        const existingImg = user?.pfp;
        
        // Delete existing image
        if (existingImg) {
            const blobName = existingImg.split('/').pop(); 
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.delete();
        }

        const randomSrc = crypto.randomBytes(6).toString('hex'); // This random string is necessary to prevent image caching by the front-end
        const blockBlobClient = containerClient.getBlockBlobClient(`${req.params.email}${randomSrc}.jpeg`);
        const uploadResp = await blockBlobClient.uploadFile(req.file.path);
        if (uploadResp == null) return res.status(404).json({ error: 'Failed to upload the image.' });
        const imgURL = `https://mapstudio.blob.core.windows.net/images/${req.params.email}${randomSrc}.jpeg`;
        await User.findOneAndUpdate({ email: req.params.email }, { pfp: imgURL });
        res.send({success: true, imgURL: imgURL});
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

setBio = async (req, res) => {
    try {
        await User.findOneAndUpdate({ email: req.params.email }, { bio: req.body.bio });
        res.send({success: true, bio: req.body.bio});
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

getUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (user == null) return res.status(404).json({ error: 'User not found.' });
        res.send({success: true, user: user});
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }

}

getUserById = async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).json({ error: 'No user ID provided.' });
        const user = await User.findOne({ _id: req.params.id });
        if (user == null) return res.status(404).json({ error: 'User not found.' });
        res.send({success: true, user: user});
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }

}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    verifyResetToken,
    resetPassword,
    setProfilePicture,
    setBio,
    getUser,
    getUserById
}