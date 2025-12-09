require('dotenv').config();
const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { Upload } = require('@aws-sdk/lib-storage');
const s3 = require('./s3');
const fs = require('fs');
const { processSingleImage } = require('./worker');

const worker = new Worker('upload-queue', async job => {
    // Handle DB Image Processing Job
    if (job.name === 'process-db-image') {
        console.log(`[Queue] Processing DB Image ID: ${job.data.image_id}`);
        await processSingleImage(job.data);
        return;
    }

    const { filePath, originalName, mimeType, customFilename } = job.data;
    
    console.log(`[Queue] Processing upload for ${customFilename || originalName}`);

    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at ${filePath}`);
        }

        const fileStream = fs.createReadStream(filePath);
        
        // The PHP service expects the file to be at /uploads/{filename}
        const key = 'uploads/' + (customFilename || originalName);

        const upload = new Upload({
            client: s3,
            params: {
                Bucket: process.env.AWS_BUCKET,
                Key: key,
                Body: fileStream,
                ContentType: mimeType,
            },
        });

        await upload.done();
        
        console.log(`[Queue] Uploaded ${key} successfully.`);

        // Clean up local file
        fs.unlink(filePath, (err) => {
            if (err) console.error(`[Queue] Failed to delete local file ${filePath}:`, err);
        });

    } catch (error) {
        console.error(`[Queue] Upload failed for ${customFilename}:`, error);
        throw error;
    }
}, { connection });

console.log('Upload Queue Worker started...');

module.exports = worker;
