const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const json = require("jsonwebtoken");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
        },
        role: {
          type: String,
          enum: ["viewer", "editor"],
          default: "viewer",
        },
      },
    ],
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
