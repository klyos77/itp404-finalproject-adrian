import React, { useState } from 'react';

const JournalFormModal = ({ show, onClose, onSubmit, entry }) => {
  const [title, setTitle] = useState(entry ? entry.title : '');
  const [body, setBody] = useState(entry ? entry.body : '');
  const [imgUrl, setImgUrl] = useState(entry ? entry.imgUrl : '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!body) newErrors.body = "Body is required";
    if (!imgUrl) newErrors.imgUrl = "img Url is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const currentTimeStamp = new Date().toISOString();
    onSubmit({ title, body, imgUrl, timeStamp: currentTimeStamp });
  };

  if (!show) {
    return null;
  }

  return (
    <div style={modalStyle}>
      <h2 style={modalHeaderStyle}>{entry ? 'Edit Journal Entry' : 'Add Journal Entry'}</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
          {errors.title && <div style={errorStyle}>{errors.title}</div>}
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Body</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} style={textareaStyle} />
          {errors.body && <div style={errorStyle}>{errors.body}</div>}
        </div>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Image URL</label>
          <input type="text" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} style={inputStyle} />
          {errors.imgUrl && <div style={errorStyle}>{errors.imgUrl}</div>}
        </div>
        <div style={buttonGroupStyle}>
          <button type="submit" style={buttonStyle}>Submit</button>
          <button onClick={onClose} style={buttonStyle}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

const errorStyle = {
    color: 'red',
    fontSize: '0.8em',
    marginTop: '2px'
  };

const modalStyle = {
  position: 'fixed', 
  top: '50%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)', 
  backgroundColor: 'white', 
  padding: '20px', 
  zIndex: 100,
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
};

const modalHeaderStyle = {
  marginBottom: '20px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const labelStyle = {
  marginBottom: '5px'
};

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const textareaStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  minHeight: '100px'
};

const buttonStyle = {
  padding: '10px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer',
  margin: '5px 0'
};

const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px'
  };

export default JournalFormModal;
