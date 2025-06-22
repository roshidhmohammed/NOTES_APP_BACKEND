const express = require("express")
const { userAuth, noteAccessAuth } = require("../middlewares/authentication")
const { createNote, getNote, colloboratorLists, addColloborator, getAllNotes, editNoteAccess, deleteNote } = require("../controllers/notes")

const noteRouter = express.Router()

noteRouter.post("/create", userAuth,  createNote)
noteRouter.get("/details/:id", userAuth, noteAccessAuth,  getNote)
noteRouter.patch("/edit/access/:id", userAuth, noteAccessAuth,  editNoteAccess)
noteRouter.get("/colloborators/:id", userAuth , noteAccessAuth, colloboratorLists)
noteRouter.patch("/add/colloborator/:id",userAuth,noteAccessAuth, addColloborator)
noteRouter.get("/all",userAuth, getAllNotes)
noteRouter.delete("/delete/:id",userAuth,noteAccessAuth,  deleteNote)



module.exports = noteRouter