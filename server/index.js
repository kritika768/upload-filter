const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const xlsx = require('xlsx');
const fs = require('fs');
const path = require("path");
const app = express();
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://kritikabhagwat2608live:Kriti123@cluster0.noa3x4v.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

const fileSchema = new mongoose.Schema({
  filename: String,
});

const File = mongoose.model("File", fileSchema);


const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { filename } = req.file;
    const file = new File({ filename });
    await file.save();
    res.status(201).json({ filename });
  } catch (error) {
    res.status(500).send(error.message);
  }
});



app.get("/files", async (req, res) => {
  try {
    const files = await File.find({}, "filename");
    res.json(files);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post('/uploadF', upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.path;
    const tagName = req.body.tag; 
    const filteredData = filterDataByTagName(filePath, tagName);
    res.json(filteredData);
  } catch (error) {
    console.error('Error filtering data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function filterDataByTagName(filePath, tagName) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = [];

    let currentRow = {}; 

    for (const cellAddress in worksheet) {
      const cell = worksheet[cellAddress];
      if (cell.v === tagName) {
        const rowNumber = parseInt(cellAddress.match(/\d+/)[0]);
        
        if (rowNumber !== currentRow.rowNumber) {
          if (Object.keys(currentRow).length > 0) {
            data.push(currentRow);
          }

          currentRow = { rowNumber };
        }

        currentRow[cellAddress.match(/[A-Z]+/)[0]] = cell.v;
      }
    }

    if (Object.keys(currentRow).length > 0) {
      data.push(currentRow);
    }

    return data;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw error;
  }
}




app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
