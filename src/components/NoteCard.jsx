import { useState } from 'react';

const NoteCard = ({ note, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ title: note.title, content: note.content });

  const handleSave = () => {
    onUpdate(note._id, form);
    setIsEditing(false);
  };

  return (
    <div className="note-card">
      {isEditing ? (
        <>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <small>{new Date(note.createdAt).toLocaleString()}</small>
          <div className="note-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => onDelete(note._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default NoteCard;
