import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRunning, faBed, faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import Card from './Card';
import JournalFormModal from './JournalFormModal';
import { toast } from 'react-toastify';
import Dropdown from './Dropdown';



export default function UserPage() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const navigate = useNavigate();
  const { userId: currentUserId } = useParams();
  const [userStatus, setUserStatus] = useState('none'); 
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);


  const statusOptions = [
    { value: 'none', name: 'None', icon: faUser },
    { value: 'working out', name: 'Working Out', icon: faRunning },
    { value: 'sleeping', name: 'Sleeping', icon: faBed },
    { value: 'studying', name: 'Studying', icon: faBook }
  ];


  const getStatusIcon = () => {
    switch (userStatus) {
      case 'working out':
        return <FontAwesomeIcon icon={faRunning} />;
      case 'sleeping':
        return <FontAwesomeIcon icon={faBed} />;
      case 'studying':
        return <FontAwesomeIcon icon={faBook} />;
      default:
        return <FontAwesomeIcon icon={faUser} />;
    }
  };


  useEffect(() => {
    if (!currentUserId) {
      navigate('/login');
      return;
    }

    // Fetch user data
    fetch(`http://localhost:5000/users/${currentUserId}`)
      .then(response => response.json())
      .then(userData => {
        setUser(userData);
        document.title = `${userData.name}'s Profile`;
        // Fetch favorite recipes with timestamps
        const favoritePromises = userData.favorites.map(favorite =>
          fetch(`http://localhost:5000/workout_recipe/${favorite.id}`)
            .then(res => res.json())
            .then(recipeData => ({ ...recipeData, addedTimestamp: favorite.timestamp }))
        );
        return Promise.all(favoritePromises);
      })
      .then(favRecipes => setFavorites(favRecipes));

    // Fetch journal entries
    fetch(`http://localhost:5000/workout_journal?userId=${currentUserId}`)
      .then(response => response.json())
      .then(journalData => setJournalEntries(journalData));
  }, [navigate, currentUserId]);

  if (!user) return <div>Loading...</div>;

  const handleDeleteFavorite = favoriteId => {
    fetch(`http://localhost:5000/users/${currentUserId}`)
      .then(response => response.json())
      .then(userData => {
        // Remove the favorite from the user's favorites
        const updatedFavorites = userData.favorites.filter(fav => fav.id !== favoriteId);
        const updatedUserData = { ...userData, favorites: updatedFavorites };
  
        // Update the user data on the server
        return fetch(`http://localhost:5000/users/${currentUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUserData)
        });
      })
      .then(response => {
        if (response.ok) {
          setFavorites(favorites.filter(fav => fav.id !== favoriteId));
          toast.success("Favorite deleted successfully");
        } else {
          toast.error("Failed to delete favorite");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        toast.error("An error occurred");
      });
  };

  const handleDeleteJournalEntry = journalId => {
    fetch(`http://localhost:5000/workout_journal/${journalId}`, {
      method: "DELETE",
    }).then(response => {
      if (response.ok) {
        setJournalEntries(journalEntries.filter(entry => entry.id !== journalId));
        toast.success("Journal entry deleted successfully");
      } else {
        toast.error("Failed to delete journal entry");
      }
    });
  };

  const handleSubmitJournalEntry = (entryData) => {
    const url = editingEntry
      ? `http://localhost:5000/workout_journal/${editingEntry.id}`
      : `http://localhost:5000/workout_journal`;
    const method = editingEntry ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...entryData, userId: currentUserId })
    })
    .then(response => {
      if (response.ok) {
        if (editingEntry) {
          setJournalEntries(journalEntries.map(entry => entry.id === editingEntry.id ? { ...entry, ...entryData } : entry));
          toast.success("Journal entry updated successfully");
        } else {
          return response.json().then(data => {
            setJournalEntries([...journalEntries, data]);
            toast.success("Journal entry created successfully");
          });
        }
      } else {
        toast.error(`Failed to ${editingEntry ? 'update' : 'create'} journal entry`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      toast.error("An error occurred");
    })
    .finally(() => {
      setShowModal(false);
    });
  };

  const handleAddJournalEntry = () => {
    setEditingEntry(null);
    setShowModal(true);
  };

  const handleEditJournalEntry = (entryId) => {
    const entryToEdit = journalEntries.find(entry => entry.id === entryId);
    setEditingEntry(entryToEdit);
    setShowModal(true);
  };





  return (
    <div className="container mt-3">
      <h2 className="mr-2">
        {user.name}'s Page
        <Dropdown
          options={statusOptions}
          selectedValue={userStatus}
          onChange={(e) => setUserStatus(e.target.value)}
        />
      </h2>
      <div style={{ position: 'relative' }}>
        {user.profilePicUrl && (
          <>
            <img src={user.profilePicUrl} alt={`${user.name}'s profile`} className="img-fluid rounded-circle mb-3" style={{ width: '200px', height: '200px' }} />
            <div style={{ position: 'absolute', top: 0, left: 0 }}>
              {getStatusIcon()}
            </div>
          </>
        )}
      </div>

      <JournalFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitJournalEntry}
        entry={editingEntry}
      />
      
      <div>
        <h3>Favorites</h3>
        <div  style={{ marginRight:'20px'}}>
          {favorites.map((fav) => (
            <Card 
              key={fav.id} 
              id={fav.id}
              title={fav.title} 
              body={fav.body} 
              imgUrl={fav.imgUrl} 
              timeStamp={fav.addedTimestamp} 
              displayOnUserPage={true}
              detailPageLink={`/workout-recipes/${fav.id}`}
              onDelete={handleDeleteFavorite}
              isEditable={false}
            />
          ))}
        </div>
      </div>
      <div>
        <h3>Journal Entries</h3>
        <span style={{ cursor: 'pointer', fontSize: '24px', marginLeft: '10px' }} onClick={handleAddJournalEntry}>&#43;</span>
        {journalEntries.map((entry) => (
            <Card 
            key={entry.id} 
            id={entry.id}
            title={entry.title} 
            body={entry.body} 
            imgUrl={entry.imgUrl} 
            timeStamp={entry.timeStamp} 
            displayOnUserPage={true}
            onDelete={handleDeleteJournalEntry}
            onEdit={() => handleEditJournalEntry(entry.id)}
            isEditable={true}
            
        />

        ))}
 
      </div>
    </div>
  );
}

