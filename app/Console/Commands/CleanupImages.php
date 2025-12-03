<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;
use Aws\S3\S3Client;

class CleanupImages extends Command
{
    protected $signature = 'images:cleanup';
    protected $description = 'Xóa ảnh status=delete và dọn dẹp file rác trong temp_images quá 24h';

    public function handle()
    {
        // Cấu hình S3 Client
        $s3 = new S3Client([
            'region' => 'auto',
            'endpoint' => env('AWS_ENDPOINT'),
            'credentials' => [
                'key'    => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
            'version' => 'latest',
            'use_path_style_endpoint' => true,
        ]);

        $bucket = env('AWS_BUCKET');

        // PHẦN 1: Xóa ảnh được đánh dấu xóa trong Database
        $images = ProductImage::where('status', 'delete')->get();
        
        if ($images->isNotEmpty()) {
            $this->info('Tìm thấy ' . $images->count() . ' ảnh cần xóa.');
            
            foreach ($images as $image) {
                // 1. Xóa trên R2 (Nếu là link public)
                if ($image->image_url && str_starts_with($image->image_url, 'http')) {
                    try {
                        // Lấy Key từ URL
                        $key = ltrim(parse_url($image->image_url, PHP_URL_PATH), '/');
                        
                        $s3->deleteObject([
                            'Bucket' => $bucket,
                            'Key'    => $key,
                        ]);
                        $this->info("Đã xóa trên R2: $key");
                    } catch (\Exception $e) {
                        $this->error("Lỗi xóa R2 ID {$image->image_id}: " . $e->getMessage());
                    }
                }

                // 2. Xóa trên Local (Nếu còn file temp)
                if ($image->temporary_url && Storage::disk('public')->exists($image->temporary_url)) {
                    Storage::disk('public')->delete($image->temporary_url);
                }

                // 3. Xóa khỏi Database
                $image->delete();
            }
        }

        // PHẦN 2: Quét và xóa file rác (Orphan files) trong thư mục temp_images
        $this->info('Đang quét file rác trong storage/app/public/temp_images...');
        
        // Lấy tất cả file trong thư mục temp_images
        $files = Storage::disk('public')->files('temp_images');
        $deletedCount = 0;
        $now = time();
        $ttl = 24 * 60 * 60; // 24 giờ (Thời gian sống của file tạm)

        foreach ($files as $file) {
            // Bỏ qua file .gitignore hoặc file giữ chỗ nếu có
            if (str_ends_with($file, '.gitignore')) continue;

            // Lấy thời gian sửa đổi lần cuối của file
            $lastModified = Storage::disk('public')->lastModified($file);
            
            // Nếu file cũ hơn 24h
            if (($now - $lastModified) > $ttl) {
                // Kiểm tra kỹ: File này có đang được dùng trong DB không?
                // (Phòng trường hợp Worker bị treo quá 24h chưa xử lý xong)
                $existsInDb = ProductImage::where('temporary_url', $file)->exists();
                
                if (!$existsInDb) {
                    Storage::disk('public')->delete($file);
                    $this->info("Đã xóa file rác: $file");
                    $deletedCount++;
                }
            }
        }

        $this->info("Hoàn tất! Đã dọn dẹp $deletedCount file rác.");
    }
}
