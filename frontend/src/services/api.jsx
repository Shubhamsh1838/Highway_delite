import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Notes API - Using axios default headers
export const notesAPI = {
  // Get all notes
  getNotes: () => axios.get('/api/notes'),
  
  // Create a new note
  createNote: (noteData) => axios.post('/api/notes', noteData),
  
  // Update a note
  updateNote: (id, noteData) => axios.put(`/api/notes/${id}`, noteData),
  
  // Delete a note
  deleteNote: (id) => axios.delete(`/api/notes/${id}`)
};
