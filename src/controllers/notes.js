const Note = require("../models/notes");
const User = require("../models/user");

const createNote = async (req, res) => {
  try {
    const userId = req.user?._id;

    const newNote = new Note({
      creator: userId,
    });
    await newNote.save();

    res.status(201).json({
      message: "Successfully created new note",
      noteId: newNote?._id,
    });
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const note = await Note.findById(id);
    if (!note) {
      throw new Error("No Notes Found");
    }

    let editable = false;

    const isEditable = await Note.findOne({
      _id: note._id, // optional: if you're checking a specific note
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

    editable = isEditable;

    res.status(200).json({
      message: "Successfully send the notes",
      noteTitle: note?.title,
      noteContent: note?.content,
      editable,
    });
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

const colloboratorLists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findById({ _id: id });

    if (!note) {
      throw new Error("Note not found");
    }

    const collaboratorUserIds = note.collaborators.map((c) =>
      c.user.toString()
    );

    const excludedUserIds = [req.user._id, ...collaboratorUserIds];

    const colloborators = await User.find({
      _id: { $nin: excludedUserIds },
    });

    res.status(200).json({
      message: "Successfully fetched the colloborator Lists",
      colloborators,
    });
  } catch (error) {
    res.status(400).send("Error :" + error);
  }
};

const addColloborator = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById({ _id: id });

    if (!note) {
      throw new Error("Note not found");
    }
    const { colloboratorId, role } = req.body;

    const alreadyAdded = note.collaborators.find(
      (c) => c.user.toString() === colloboratorId
    );

    if (alreadyAdded) {
      throw new Error("User is already a collaborator");
    }

    note.collaborators.push({ user: colloboratorId, role });
    await note.save();
    res.status(200).json({
      message: "Successfully added this user as your collaborator",
    });
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

const getAllNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { search = "", filter } = req.query;

    const query = {
      $and: [
        {
          $or: [{ creator: userId }, { "collaborators.user": userId }],
        },
      ],
    };

    if (filter === "creator") {
      query.$and.push({ creator: userId });
    } else if (filter === "colloborator") {
      query.$and.push({ "collaborators.user": userId });
    }

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$and.push({
        $or: [{ title: regex }, { content: regex }],
      });
    }

    const notes = await Note.find(query)
      .populate("creator", "userName email")
      .populate("collaborators.user", "userName email");

    res.status(200).json({
      message: "Fetched requested notes",
      notes,
    });
  } catch (error) {
    res.status(400).send(`${error}`);
  }
};

const editNoteAccess = async (req, res) => {
  try {
    res.send(200).json({
      message: "You can edit this mote",
    });
  } catch (error) {
    res.status(401).send(`${error}`);
  }
};

const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user._id;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await Note.findByIdAndDelete(noteId);

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(40).send(error);
  }
};

module.exports = {
  createNote,
  getNote,
  colloboratorLists,
  addColloborator,
  getAllNotes,
  editNoteAccess,
  deleteNote,
};
