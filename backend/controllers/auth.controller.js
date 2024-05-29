import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";


export const signUpUser = async (req, res) => {
    try {
        const {fullName, userName, password, confirmPassword, gender} = req.body;

        if(password !== confirmPassword) {
            return res.status(400).json({error: "Password do'not match"});
        }

        const user = await User.findOne({userName});

        if(user) {
            return res.status(400).json({error: "User name already exists"});
        }

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User ({
            fullName,
            userName,
            password : hashedPassword,
            gender,
            profilePic: gender==='male' ? boyProfilePic : girlProfilePic,
        });

        if(newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                profilePic: newUser.profilePic
            });

        } 
        else {
            res.status(400).json({error : "Invalid user data"});
        }

    } catch (error) {
        res.status(500).json({error: "Error occured"});
    }
}

export const loginUser = async (req, res) => {
    try {
        const {userName, password} = req.body;

        const user = await User.findOne({userName});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid user name or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            profilePic: user.profilePic
        })


    } catch (error) {
        res.status(500).json({error: "Error occured in login"});
    }
}

export const LogoutUser = async (req, res) => {
    try {
        res.cookie("jwt","", {
            maxAge: 0
        });
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        res.status(500).json({error: "Error occured in Logout"});
    }
}