const validator = require("validator");

const registerValidation = (req) => {
  const { userName, email, password } = req.body.data;
  const allowedField = ["userName", "email", "password"];
  const isRegistrationAllowed = Object.keys(req.body.data).every((key) =>
    allowedField.includes(key)
  );
  if (!isRegistrationAllowed) {
    throw new Error("Registration not allowed");
  } else if (!userName) {
    throw new Error("Please enter user name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter the valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter the strong password");
  }
};

const loginValidation = (req) => {
  const { email, password } = req.body.data;
  if (!email || !password) {
    throw new Error("Please enter all the credentials");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid login Details");
  }
};

module.exports = {
  registerValidation,
  loginValidation,
};
