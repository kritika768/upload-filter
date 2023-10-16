import React, { useState } from 'react';

const Filter = () => {
  const [file, setFile] = useState(null);
  const [tag, setTag] = useState('');
  const [filteredData,setFilteredData] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (file && tag) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tag', tag);

      fetch('http://localhost:8000/uploadF', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setFilteredData(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      alert('Please select a file and enter a tag.');
    }
  };

  return (
    <div>
      <h2>File Upload and Filter</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Enter Tag"
          value={tag}
          onChange={handleTagChange}
        />
        <button type="submit">Upload and Filter</button>
      </form>
    </div>
  );
};

export default Filter;
