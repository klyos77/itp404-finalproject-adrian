import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login Page";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
  
    try {
      const response = await fetch('http://localhost:5000/users');
      const users = await response.json();
      const user = users.find(u => u.userName === username);
  
      if (user && user.password === password) {
        
        sessionStorage.setItem('userId', user.id);
  
       
        navigate(`/user/${user.id}`);

      } else {
        setErrorMessage('Username does not match the password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login.');
    }
  };

  return (
    <div className="container mt-3">
      <h2>Login</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            className="form-control"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">Login</button>
      </form>
    </div>
  );
}