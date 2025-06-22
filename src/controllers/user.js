const {
  registerValidation,
  loginValidation,
} = require("../utils/validation/user");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const json = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const register = async (req, res) => {
  try {
    registerValidation(req);
    const { userName, email, password } = req.body.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      userName,
      email,
      password: hashedPassword,
    });

    const isEmailExist = await User.findOne({ email: email });
    if (isEmailExist) {
      throw new Error("This Email Id already exist");
    }

    await user.save();
    res.status(201).json({
      message: "Your account is successfully registered",
    });
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body.data;
    loginValidation(req);
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Login Details");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Login credentials");
    } else {
      const token = await json.sign({ _id: user?._id }, jwtSecretKey, {
        expiresIn: "1d",
      });
      if (token) {
        res.cookie("auth_token", token, {
          maxAge: 9000000,
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
        });
        res.status(200).json({
          message: "Login Successfull!",
        });
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const authentication = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const logout = async (req, res, next) => {
  try {
    res
      .cookie("auth_token", null, {
        expires: new Date(),
      })
      .send("Logout Successful!!!");
  } catch (error) {
    res.status(400).send("Error :" + error);
  }
};

module.exports = { register, login, authentication, logout };
