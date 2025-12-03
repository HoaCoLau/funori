<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;
use Aws\S3\S3Client;

class CleanupImages extends Command
{
    protected $signature = 'images:cleanup';
    protected $description = 'Xóa ảnh status=delete và dọn dẹp file rác (An toàn cho dữ liệu lớn)';

    public function handle()
    {
        $start = microtime(true);

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

        $this->info('Bắt đầu quy trình dọn dẹp...');

        // --- PHẦN 1: Xóa ảnh status='delete' (Dùng chunkById để tránh tràn RAM và lỗi SQL) ---
        // Lấy từng gói 1000 bản ghi để xử lý
        $countDeleted = 0;
        
        ProductImage::where('status', 'delete')->chunkById(1000, function ($images) use ($s3, $bucket, &$countDeleted) {
            $s3KeysToDelete = [];
            $localFilesToDelete = [];
            $idsToDelete = [];

            foreach ($images as $image) {
                // Gom nhóm Key R2
                if ($image->image_url && str_starts_with($image->image_url, 'http')) {
                    $key = ltrim(parse_url($image->image_url, PHP_URL_PATH), '/');
                    $s3KeysToDelete[] = ['Key' => $key];
                }

                // Gom nhóm File Local
                if ($image->temporary_url) {
                    $localFilesToDelete[] = $image->temporary_url;
                }

                $idsToDelete[] = $image->image_id;
            }

            // 1. Xóa R2 (Batch Delete)
            if (!empty($s3KeysToDelete)) {
                try {
                    $s3->deleteObjects([
                        'Bucket' => $bucket,
                        'Delete' => ['Objects' => $s3KeysToDelete],
                    ]);
                } catch (\Exception $e) {
                    $this->error("Lỗi xóa R2: " . $e->getMessage());
                }
            }

            // 2. Xóa Local (Batch Delete)
            if (!empty($localFilesToDelete)) {
                Storage::disk('public')->delete($localFilesToDelete);
            }

            // 3. Xóa Database (Batch Delete - An toàn vì chỉ có 1000 ID)
            ProductImage::whereIn('image_id', $idsToDelete)->delete();

            $countDeleted += count($idsToDelete);
            $this->info("Đã xử lý xong gói " . count($idsToDelete) . " ảnh...");
        });

        if ($countDeleted > 0) {
            $this->info("TỔNG CỘNG: Đã xóa $countDeleted ảnh khỏi Database và Cloud.");
        } else {
            $this->info("Không có ảnh nào cần xóa trong Database.");
        }

        // --- PHẦN 2: Quét file rác (Giữ nguyên logic tối ưu RAM) ---
        $this->info('Đang quét file rác hệ thống...');
        
        $files = Storage::disk('public')->files('temp_images');
        
        // Lấy danh sách file đang dùng (Chỉ lấy cột temporary_url để tiết kiệm RAM)
        $activeFiles = ProductImage::whereNotNull('temporary_url')
            ->pluck('temporary_url')
            ->flip()
            ->toArray();

        $filesToDelete = [];
        $now = time();
        $ttl = 24 * 60 * 60; 

        foreach ($files as $file) {
            if (str_ends_with($file, '.gitignore')) continue;

            if (isset($activeFiles[$file])) continue;

            $lastModified = Storage::disk('public')->lastModified($file);
            if (($now - $lastModified) > $ttl) {
                $filesToDelete[] = $file;
            }
        }

        // Chia nhỏ mảng file rác để xóa nếu quá nhiều (tránh lỗi quá giới hạn tham số)
        if (!empty($filesToDelete)) {
            $chunks = array_chunk($filesToDelete, 1000);
            foreach ($chunks as $chunk) {
                Storage::disk('public')->delete($chunk);
                $this->info("Đã xóa " . count($chunk) . " file rác local.");
            }
        } else {
            $this->info("Không có file rác nào.");
        }

        $duration = round(microtime(true) - $start, 2);
        $this->info("Hoàn tất toàn bộ trong {$duration} giây.");
    }
}
