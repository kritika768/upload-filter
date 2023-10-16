import { useEffect, useState } from "react";
import axios from 'axios';

const FileUpload = () =>{
    const [file, setFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]); 
    const [isClick,setIsClick] = useState(false);
    const [filteredData, setFilteredData] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }
  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
    } catch (error) {
      alert('File upload failed. Please try again.');
    }
  };
  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:8000/upload', formData)
      .then((response) => {
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
    useEffect(()=>{
      fetch('http://localhost:8000/files')
      .then((res) => res.json())
      .then((data) =>{
        console.log(data);
        setUploadedFiles(data);
      })
    },[])
  
    const clickHandler = () =>{
       setIsClick(true);
    }
  return (
    <div>
      <h1>File Upload Example</h1>
       <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload File</button><br  />
      <button onClick={clickHandler}>Fetch</button>
      <h2>Uploaded Files:</h2>
      {
        isClick ?
        <ul style={{display:"inline-block"}}>
        {uploadedFiles.map((file, index) => (
          <li key={index}>{file.filename}</li>
        ))}
      </ul>
      :(
        <div><h3>Click to fetch</h3></div>
      )
      }
      
       
    </div>
  );
}

export default FileUpload;