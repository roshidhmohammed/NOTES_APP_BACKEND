const express = require("express")
const { register, login, authentication, logout } = require("../controllers/user")
const { userAuth } = require("../middlewares/authentication")

const userRouter = express.Router()

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.get("/auth",userAuth,  authentication)
userRouter.post("/logout", logout)

module.exports = userRouter