import React, { useEffect } from 'react';

export default function Home() {
    useEffect(() => {
        document.title = "Home Page";
      }, []);
      
    return (
      <div className="container mt-3">
        <h1>Fitness Body</h1>
        <p>Welcome to Fitness Body, your go-to app for managing your workout routines and nutrition plans. Here you can keep a workout journal, save your favorite recipes, and much more!</p>
      </div>
    );
  }