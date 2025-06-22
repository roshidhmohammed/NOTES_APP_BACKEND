const json = require("jsonwebtoken");
const User = require("../models/user");
const Note = require("../models/notes");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const userAuth = async (req, res, next) => {
  try {
    const { auth_token } = req.cookies;
    if (!auth_token) {
      throw new Error("Please Login Again");
    }

    const decodedObj = json.verify(auth_token, jwtSecretKey);
    if (!decodedObj) {
      throw new Error("User session expired");
    }
    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("This credential is not valid");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const noteAccessAuth = async (req, res, next) => {
  try {
    const noteId = req.params.id || req.body.id || req.query.id;
    const userId = req.user._id;

    if (!noteId) {
      throw new Error("Note ID is required");
    }

    const note = await Note.findOne({
      _id: noteId,
      $or: [
        { creator: userId },
        {
          collaborators: {
            $elemMatch: {
              user: userId,
              role: "editor",
            },
          },
        },
      ],
    });

    if (!note) {
      throw new Error("Access denied");
    }

    req.note = note;
    req.user = req.user;
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
};

module.exports = { userAuth, noteAccessAuth };
