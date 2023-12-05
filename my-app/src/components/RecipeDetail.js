import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';


const RecipeDetailPage = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [user, setUser] = useState(null);
    const currentUserId = sessionStorage.getItem('userId');
  
    useEffect(() => {
      if (!recipeId) return;
  
      // Fetch the recipe details
      fetch(`http://localhost:5000/workout_recipe/${recipeId}`)
      .then(response => response.json())
      .then(data => {
        setRecipe(data);
        document.title = `${data.title}'s Page`; 
      });
  
      // Fetch the user data and check if the recipe is in user's favorites
      fetch(`http://localhost:5000/users/${currentUserId}`)
        .then(response => response.json())
        .then(userData => {
          setUser(userData);
          const favoriteExists = userData.favorites.some(fav => fav.id === recipeId);
          setIsFavorite(favoriteExists);
        });
    }, [recipeId, currentUserId]);
  
    const handleToggleFavorite = () => {
        const updatedUser = {
          ...user,
          favorites: isFavorite
            ? user.favorites.filter(fav => fav.id !== recipeId)
            : [...user.favorites, { id: recipeId, timestamp: new Date().toISOString() }]
        };
    
        fetch(`http://localhost:5000/users/${currentUserId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser)
        })
        .then(response => {
          if (response.ok) {
            setIsFavorite(!isFavorite);
            setUser(updatedUser);
            toast.success(`Recipe ${isFavorite ? 'removed from' : 'added to'} favorites`);
          } else {
            toast.error(`Failed to ${isFavorite ? 'remove recipe from' : 'add recipe to'} favorites`);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          toast.error("An error occurred");
        });
      };
  
    if (!recipe) return <div>Loading...</div>;

  return (
    <div>
        <div className='d-flex flex-row'>
      <h1>{recipe.title}</h1>
      <span style={{ cursor: 'pointer' }} onClick={handleToggleFavorite}>
        <FontAwesomeIcon icon={isFavorite ? fasStar : farStar} style={isFavorite ? { color: '#fff70f' } : { color: '#c4bfbf' }}/>
      </span>
      </div>
      <img src={recipe.imgUrl} alt={recipe.title} style={{ width: '200px', height: '200px', marginRight: '15px', objectFit: 'cover' }}/>
      <p>{recipe.body}</p>

    </div>
  );
};

export default RecipeDetailPage;


