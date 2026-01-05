import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    publishedYear: '',
    availableCopies: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/books`;


  // Fetch Books
  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL);
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({
        title: '',
        author: '',
        category: '',
        publishedYear: '',
        availableCopies: ''
      });
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Error saving book. Please check your input.');
    }
  };

  // Delete Book
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  // Edit Setup
  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      publishedYear: book.publishedYear,
      availableCopies: book.availableCopies
    });
    setEditingId(book._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helpers
  const getStockStatus = (copies) => {
    if (copies === 0) return { label: 'Out of Stock', class: 'out-stock' };
    if (copies < 3) return { label: 'Low Stock', class: 'low-stock' };
    return { label: 'In Stock', class: 'in-stock' };
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Library Portal</h1>
        <p>Manage your collection with style</p>
      </header>

      <div className="main-content">
        {/* Form Section */}
        <div className="form-card">
          <h2>{editingId ? 'Edit Book' : 'Add New Book'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ex: The Great Gatsby"
              />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                name="author"
                className="form-control"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Ex: F. Scott Fitzgerald"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="Ex: Classic"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="publishedYear"
                  className="form-control"
                  value={formData.publishedYear}
                  onChange={handleChange}
                  required
                  placeholder="2024"
                />
              </div>

              <div className="form-group">
                <label>Copies</label>
                <input
                  type="number"
                  name="availableCopies"
                  className="form-control"
                  value={formData.availableCopies}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="5"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Book' : 'Add to Collection'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: '1rem', background: 'transparent', border: '1px solid #cbd5e1' }}
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', author: '', category: '', publishedYear: '', availableCopies: '' });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* List Section */}
        <div className="books-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Collection ({books.length})</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading library...</div>
          ) : (
            <div className="books-grid">
              {books.map((book) => {
                const stock = getStockStatus(book.availableCopies);
                return (
                  <div key={book._id} className="book-card">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>

                    <div className="book-details">
                      <span>{book.category}</span>
                      <span>{book.publishedYear}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className={`stock-badge ${stock.class}`}>
                        {stock.label}: {book.availableCopies}
                      </span>
                    </div>

                    <div className="book-actions">
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(book)}
                        title="Edit"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(book._id)}
                        title="Delete"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && books.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <p>No books in the collection yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
