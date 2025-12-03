require('dotenv').config();
const mysql = require('mysql2/promise');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require('fs');
const path = require('path');

// Cấu hình S3 Client
const s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});

// Cấu hình Database Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USERNAME || 'sail',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'funori',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 20, // Tăng limit kết nối DB
    queueLimit: 0
});

const LARAVEL_STORAGE_PATH = process.env.LARAVEL_STORAGE_PATH || '/var/www/html/storage/app/public';

// Hàm xử lý 1 ảnh riêng biệt
async function processSingleImage(image) {
    const localFilePath = path.join(LARAVEL_STORAGE_PATH, image.temporary_url);
    
    // 1. Kiểm tra file
    if (!fs.existsSync(localFilePath)) {
        console.warn(`[ID ${image.image_id}] File not found: ${localFilePath}`);
        // Nếu đã có link R2 thì coi như xong, update public
        if (image.image_url && image.image_url.startsWith('http')) {
             await pool.execute("UPDATE product_images SET status = 'public' WHERE image_id = ?", [image.image_id]);
             return;
        }
        // Nếu chưa có gì mà mất file -> Đánh dấu lỗi để không lặp lại
        await pool.execute("UPDATE product_images SET status = 'pending_retry' WHERE image_id = ?", [image.image_id]);
        return;
    }

    // 2. Upload
    const ext = path.extname(image.temporary_url);
    const baseName = path.basename(image.temporary_url, ext);
    const uniqueFileName = `products/${baseName}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;

    console.log(`[ID ${image.image_id}] Uploading...`);

    try {
        const fileStream = fs.createReadStream(localFilePath);
        const upload = new Upload({
            client: s3,
            params: {
                Bucket: process.env.AWS_BUCKET,
                Key: uniqueFileName,
                Body: fileStream,
                ContentType: 'image/jpeg',
            },
        });

        await upload.done();
        
        // 3. Update DB
        const baseUrl = process.env.AWS_URL || process.env.R2_PUBLIC_DOMAIN;
        const publicUrl = `${baseUrl}/${uniqueFileName}`;

        await pool.execute(
            "UPDATE product_images SET status = 'public', image_url = ?, temporary_url = NULL WHERE image_id = ?",
            [publicUrl, image.image_id]
        );

        // 4. Xóa file local
        try {
            if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        } catch (e) { /* Ignore unlink error */ }

        console.log(`[ID ${image.image_id}] DONE.`);

    } catch (err) {
        console.error(`[ID ${image.image_id}] FAILED:`, err.message);
    }
}

async function processImages() {
    try {
        // Lấy 10 ảnh
        const [rows] = await pool.execute(
            "SELECT image_id, temporary_url, image_url FROM product_images WHERE status = 'temporary' AND temporary_url IS NOT NULL LIMIT 10"
        );

        if (rows.length === 0) {
            return setTimeout(processImages, 2000);
        }

        console.log(`Found ${rows.length} images. Processing in PARALLEL...`);

        // Chạy song song tất cả ảnh cùng lúc
        const promises = rows.map(image => processSingleImage(image));
        await Promise.all(promises);
        
        // Xử lý xong đợt này thì làm ngay đợt tiếp theo
        processImages();

    } catch (error) {
        console.error('Worker error:', error);
        setTimeout(processImages, 5000);
    }
}

console.log('Starting High-Performance Image Upload Worker...');
processImages();
