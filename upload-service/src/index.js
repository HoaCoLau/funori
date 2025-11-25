require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { uploadQueue } = require('./queue');
require('./worker'); // Start the worker in the same process for simplicity

const app = express();
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const customFilename = req.body.customFilename || req.query.customFilename;

  console.log('Received upload request:', {
      originalName: req.file.originalname,
      customFilename: customFilename,
      body: req.body,
      query: req.query
  });

  try {
    await uploadQueue.add('file-upload', {
      filePath: req.file.path,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      customFilename: customFilename,
    });

    res.json({ 
        message: 'File queued for upload', 
        fileId: req.file.filename,
        originalName: req.file.originalname,
        customFilename: customFilename
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error queuing file.');
  }
});

app.get('/health', (req, res) => {
    res.send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
