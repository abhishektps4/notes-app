import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import NoteCard from '../components/NoteCard';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [search, setSearch] = useState('');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchNotes = async () => {
    const res = await axios.get(import.meta.env.VITE_API + '/notes', config);
    setNotes(res.data);
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await axios.post(import.meta.env.VITE_API + '/notes', form, config);
    setNotes([res.data, ...notes]);
    setForm({ title: '', content: '' });
  };

  const handleDelete = async (id) => {
    await axios.delete(import.meta.env.VITE_API + `/notes/${id}`, config);
    setNotes(notes.filter(note => note._id !== id));
  };

  const handleUpdate = async (id, updatedNote) => {
    const res = await axios.put(import.meta.env.VITE_API + `/notes/${id}`, updatedNote, config);
    setNotes(notes.map(n => (n._id === id ? res.data : n)));
  };

  return (
    <div className="dashboard">
      <header>
        <h2>Hello, {user?.name}</h2>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="theme-toggle">
        <button onClick={() => {
          document.body.classList.toggle('dark');
          localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        }}>
          Toggle Theme
        </button>
        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <form className="note-form" onSubmit={handleAdd}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        <button type="submit">Add Note</button>
      </form>

      <div className="notes-grid">
        {notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
              .map(note => (
          <NoteCard key={note._id} note={note} onDelete={handleDelete} onUpdate={handleUpdate} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
