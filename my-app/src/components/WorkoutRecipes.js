import React, { useEffect, useState } from 'react';
import Card from './Card';

export default function WorkoutRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/workout_recipe')
      .then((response) => response.json())
      .then((data) => setRecipes(data));

      document.title = `Recipes' Page`;
  }, []);

  return (
    <div className="container mt-3">
      <h2>Workout Recipes</h2>
      {recipes.map((recipe) => (
        <Card
        key={recipe.id}
        title={recipe.title}
        body={recipe.body}
        imgUrl={recipe.imgUrl}
        timeStamp={recipe.timeStamp}
        displayOnUserPage={false}
        detailPageLink={`/workout-recipes/${recipe.id}`}
      />
      ))}
    </div>
  );
}

