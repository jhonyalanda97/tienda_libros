import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllBooks, deleteBook } from '../../../services/bookService';
import Navbar from '../../../components/Navbar';
import './UserBookScreen.css';
import { AuthContext } from '../../../context/AuthContext'; // Importa el contexto de autenticación
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const UserBookScreen = () => {
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext); // Obtén el rol del usuario del contexto de autenticación
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (value) => {
    return `$ ${value.toLocaleString()}`;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getAllBooks();
        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleDeleteBook = async (bookId) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres borrar este libro?`);
    
    if (confirmDelete) {
      try {
        await deleteBook(bookId);
        setBooks(books.filter(book => book.id !== bookId));
        window.alert('Libro borrado exitosamente'); // Mostrar alerta de éxito
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBooks = filteredBooks.slice().sort((a, b) => {
    return a.title.localeCompare(b.title);
  });

  return (
    <div>
      <Navbar />
      <div className="user-books-container">
        <h1>Mis Libros</h1>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Buscar libros..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
          {userRole === 'admin' && (
            <button className="button button-primary" onClick={() => navigate('/books/add')}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </div>
        <div className="book-list">
          {sortedBooks.length === 0 ? (
            <p className="no-books-message">Aún no hay libros registrados.</p>
          ) : (
            sortedBooks.map(book => (
              <div key={book.id} className="book-card">
                <div className="book-card-inside">
                  <div className="book-actions">
                    {userRole === 'admin' && (
                      <>
                        <Link to={`/books/${book.id}/edit`} className="button button-primary">
                          <FontAwesomeIcon icon={faEdit}/>
                        </Link>
                        <FontAwesomeIcon icon={faTrash} className="button button-danger" onClick={() => handleDeleteBook(book.id)} />
                      </>
                    )}
                  </div>
                  <div className="book-content">
                    <img src={book.imageUrl} alt={book.title} />
                    <div className="book-details">
                      <h2>{book.title}</h2>
                      <p><strong>Autor:</strong> {book.author}</p>
                      <p><strong>Tipo:</strong> {book.type}</p>
                      <p className="precio"><strong>Valor:</strong> {formatCurrency(book.value)}</p>
                    </div>
                  </div>
                  <div className="book-description">
                    <p>{book.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBookScreen;
