import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    navigate('/login');
  };

  const isLoggedIn = userId !== null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/workout-recipes" className="nav-link">Workout Recipes</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li className="nav-item">
              <Link to={`/user/${userId}`} className="nav-link">User Page</Link>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-link nav-link">Logout</button>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <Link to="/login" className="nav-link">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
