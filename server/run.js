require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to libraryDB');
    console.log('📚 "Book" model is loaded into the context.');
    console.log('Usage example: await Book.find({})');
    console.log('--------------------------------------');
    
    // Start REPL
    const repl = require('repl');
    const r = repl.start('> ');
    
    // Expose variables to REPL context
    r.context.mongoose = mongoose;
    r.context.Book = Book;
    
    // Handle exit
    r.on('exit', () => {
      mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    });
  })
  .catch(err => console.error('Connection Error:', err));
