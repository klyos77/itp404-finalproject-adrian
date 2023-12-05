import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import UserPage from './components/UserPage';
import Login from './components/Login';
import WorkoutRecipes from './components/WorkoutRecipes';
import RecipeDetail from './components/RecipeDetail';
import NavBar from './components/NavBar';
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:userId" element={<UserPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/workout-recipes" element={<WorkoutRecipes />} />
          <Route path="/workout-recipes/:recipeId" element={<RecipeDetail />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
   

  );
}

export default App;
