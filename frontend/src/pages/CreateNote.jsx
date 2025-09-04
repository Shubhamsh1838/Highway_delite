import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { notesAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      return setError('Please fill in both title and content');
    }
    
    setLoading(true);
    setError('');
    
    try {
      await notesAPI.createNote({ title, content });
      navigate('/');
    } catch (error) {
      console.error('Error creating note:', error);
      setError('Failed to create note');
    }
    
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src='logo.png' alt="Logo" className="header-logo" />
          <h2 className='create-header'>Create Note</h2>
        </div>
        <div className="header-right">
          {/* <span className="welcome-text">Welcome, {user?.name}</span> */}
          <button onClick={() => navigate('/')} className="dashboard-btn">
            <i className="fa-solid fa-backward"></i> Dashboard
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
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Create Note Form */}
        <div className="create-note-section">
          <h2>Create New Note</h2>
          <form onSubmit={handleSubmit} className="create-note-form">
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Note title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="title-input"
                required 
              />
            </div>
            <div className="form-group">
              <textarea 
                placeholder="Note content" 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
                rows="6" 
                required 
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/')} 
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;
