const express = require('express');
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all notes for user
// @route   GET /api/notes
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find({ 
      user: req.user.id, 
      isDeleted: false 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notes'
    });
  }
});

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content for the note'
      });
    }

    const note = await Note.create({
      title,
      content,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating note'
    });
  }
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
router.put('/:noteId', protect, async (req, res) => {
  try {
    const { title, content } = req.body;
    const noteId = req.params.id;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content for the note'
      });
    }

    let note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Make sure user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this note'
      });
    }

    note = await Note.findByIdAndUpdate(
      noteId,
      { title, content },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating note'
    });
  }
});

// @desc    Delete a note (soft delete)
// @route   DELETE /api/notes/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const noteId = req.params.id;
    console.log('Delete request for note ID:', noteId);
    console.log('User ID making request:', req.user.id);

    let note = await Note.findById(noteId);
    console.log('Found note:', note);

    if (!note) {
      console.log('Note not found in database');
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Make sure user owns the note
    if (note.user.toString() !== req.user.id) {
      console.log('User not authorized to delete this note');
      console.log('Note user ID:', note.user.toString());
      console.log('Request user ID:', req.user.id);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this note'
      });
    }

    // Check if note is already deleted
    if (note.isDeleted) {
      console.log('Note is already deleted');
      return res.status(410).json({
        success: false,
        message: 'Note is already deleted'
      });
    }

    // Soft delete by marking as deleted
    note = await Note.findByIdAndUpdate(
      noteId,
      { isDeleted: true },
      { new: true }
    );

    console.log('Note soft deleted successfully');
    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting note'
    });
  }
});
module.exports = router;