const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  publishedYear: { 
    type: Number, 
    required: true 
  },
  availableCopies: { 
    type: Number, 
    required: true, 
    min: [0, 'Stock cannot be negative']
  }
});

const Book = mongoose.model('Book', bookSchema, 'books');

module.exports = Book;
