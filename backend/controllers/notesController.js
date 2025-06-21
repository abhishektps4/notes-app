const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(notes);
};

exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.create({ title, content, userId: req.userId });
  res.json(note);
};

exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const note = await Note.findOneAndUpdate({ _id: id, userId: req.userId }, req.body, { new: true });
  res.json(note);
};

exports.deleteNote = async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ msg: "Deleted" });
};
