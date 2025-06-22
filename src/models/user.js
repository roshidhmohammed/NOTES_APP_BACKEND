const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const json = require("jsonwebtoken");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(`Email is not valid`);
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(`Your password ${value} is not strong`);
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await json.sign({ _id: user?._id }, jwtSecretKey, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const hashedPassword = user?.password;
  const isPasswordValid = await bcrypt.compare(
    userInputPassword,
    hashedPassword
  );
  return isPasswordValid;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
