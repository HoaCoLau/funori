const { Worker } = require('bullmq');
const { Upload } = require('@aws-sdk/lib-storage');
const s3Client = require('./s3');
const fs = require('fs');

const connection = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
};

const worker = new Worker('upload-queue', async job => {
  const { filePath, originalName, mimeType, customFilename } = job.data;
  console.log(`Processing upload for ${originalName}`);

  try {
    const fileStream = fs.createReadStream(filePath);
    
    const key = customFilename ? `uploads/${customFilename}` : `uploads/${Date.now()}-${originalName}`;

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Body: fileStream,
        ContentType: mimeType,
      },
    });

    const result = await upload.done();
    console.log('Upload complete:', result);

    // Clean up local file
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (err) {
        console.error('Error deleting file:', err);
    }
    
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}, { connection });

console.log('Worker started');

module.exports = worker;
