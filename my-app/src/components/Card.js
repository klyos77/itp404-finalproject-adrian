import React from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ id, title, body, imgUrl, timeStamp, displayOnUserPage, detailPageLink, onDelete, onEdit, isEditable }) => {
  const navigate = useNavigate();
  const truncateBody = (text, length) => {
    return text.split(" ").splice(0, length).join(" ") + "...";
  };

  const timePrefix = displayOnUserPage ? "Added:" : "Created:";

  const editButton = isEditable ?       <span style={{ cursor: 'pointer', position: 'absolute', top: 10, right: 30 }} 
  onClick={(e) => { e.stopPropagation(); onEdit(id); }}>&#9998;</span> : '';

  const handleCardClick = () => {
    navigate(detailPageLink);
  };

  return (
    <div className="card mb-3 d-flex flex-row" style={{ alignItems: 'center', padding: '10px', cursor: 'pointer' }} onClick={handleCardClick}>
      <img src={imgUrl} alt={title} style={{ width: '200px', height: '200px', marginRight: '15px', objectFit: 'cover' }} />
      <div>
        <h5 style={{ fontWeight: 'bold' }}>{title}</h5>
        <p>{truncateBody(body, 15)}</p>
        <small className="text-muted">{timePrefix} {timeStamp}</small>
      </div>
      {onDelete && (
        <span style={{ cursor: 'pointer', position: 'absolute', top: 10, right: 10 }} 
        onClick={(e) => { e.stopPropagation(); onDelete(id); }}>&times;</span>
      )}
      {editButton}
    </div>
  );
};

export default Card;


