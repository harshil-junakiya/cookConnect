import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body
        const existUser = await User.findOne({ email })

        if (existUser) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const userData = {
            name, email,
            password: hashedPassword
        }
        const newUser = new User(userData)
        await newUser.save()

        res.status(201).json({ success: true, message: "User created successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const existUser = await User.findOne({ email })

        if (!existUser) {
            return res.status(400).json({ success: false, message: "User does not exist" })
        }

        const isPassword = await bcrypt.compare(password, existUser.password)
        if (!isPassword) {
            return res.status(400).json({ success: false, message: "Incorrect Password" })
        }

        const token = jwt.sign({ id: existUser._id }, "secret", { expiresIn: "7d" })
        res.json({
            token, existUser: {
                id: existUser._id,
                name: existUser.name,
                email: existUser.email
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

export default router
