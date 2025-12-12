require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { uploadQueue } = require('./queue');
require('./worker'); // Start the worker in the same process for simplicity
require('./queueWorker'); // Start the Queue worker

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

app.post('/internal/upload', async (req, res) => {
    const { filename, originalName, mimeType } = req.body;
    
    if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
    }

    // The file is expected to be in /app/shared_uploads/filename
    // __dirname is /app/src, so we go up one level to /app
    const filePath = path.join(__dirname, '..', 'shared_uploads', filename);
    
    if (!fs.existsSync(filePath)) {
         console.error(`File not found at ${filePath}`);
         return res.status(404).json({ error: `File not found at ${filePath}` });
    }

    try {
        await uploadQueue.add('file-upload', {
            filePath: filePath,
            originalName: originalName || filename,
            mimeType: mimeType,
            customFilename: filename,
        });

        res.json({ 
            message: 'File queued for upload', 
            fileId: filename,
            originalName: originalName,
            customFilename: filename
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error queuing file.');
    }
});

app.post('/internal/process-batch', async (req, res) => {
    const { images } = req.body;

    if (!images || !Array.isArray(images)) {
        return res.status(400).json({ error: 'Invalid input. Expected an array of images.' });
    }

    console.log(`Received batch of ${images.length} images to process.`);

    try {
        const jobs = images.map(image => ({
            name: 'process-db-image',
            data: image
        }));

        await uploadQueue.addBulk(jobs);

        res.json({ 
            message: 'Batch queued successfully', 
            count: images.length 
        });
    } catch (error) {
        console.error('Error queuing batch:', error);
        res.status(500).json({ error: 'Failed to queue batch' });
    }
});

app.get('/health', (req, res) => {
    res.send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
