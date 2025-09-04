import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notesAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getNotes();
      setNotes(response.data.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to fetch notes');
      
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    
    setDeleteLoading(id);
    
    try {
      await notesAPI.deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note: ' + (error.response?.data?.message || error.message));
      
      if (error.response?.status === 401) {
        logout();
      }
    }
    
    setDeleteLoading(null);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src='logo.png' alt="Logo" className="header-logo" />
          <h2>Dashboard</h2>
        </div>
        <div className="header-right">
          <button onClick={logout} className="logout-btn">
            Sign Out
          </button>
        </div>
      </header>
      
      <div className="dashboard-content">
        {/* User Info Card */}
        <div className="user-info-card">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h3>Welcome, {user?.name}!</h3>
            <p>Email: {user?.email}</p>
          </div>
        </div>
        <div className="full-width-btn-container">
          <button 
            onClick={() => navigate('/create-note')} 
            className="create-note-btn-full">
            Create Note
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        
        {/* Notes Grid */}
        <div className="notes-section">
          <h2>Your Notes ({notes.length})</h2>
          {notes.length === 0 ? (
            <div className="empty-state">
              <p>No notes yet. Create your first note!</p>
              <button 
                onClick={() => navigate('/create-note')} 
                className="btn-primary"
              >
                Create Your First Note
              </button>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map(note => (
                <div key={note._id} className="note-card">
                  <div className="note-header">
                    <h3>{note.title}</h3>
                    <span className="note-date">{formatDate(note.createdAt)}</span>
                  </div>
                  <div className="note-content">
                    <p>{note.content}</p>
                  </div>
                  <div className="note-actions">
                    <button 
                      onClick={() => handleDelete(note._id)} 
                      className="btn-delete-trash" 
                      disabled={deleteLoading === note._id}
                    >
                      <i className="fa-solid fa-trash"></i>{deleteLoading === note._id ? 'Deleting...' : ''}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
