<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;
use Aws\S3\S3Client;

class CleanupImages extends Command
{
    protected $signature = 'images:cleanup';
    protected $description = 'Xóa ảnh status=delete và dọn dẹp file rác (Tối ưu tốc độ)';

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

        // --- PHẦN 1: Xóa ảnh status='delete' (Xử lý hàng loạt) ---
        $images = ProductImage::where('status', 'delete')->get();
        
        if ($images->isNotEmpty()) {
            $this->info('Tìm thấy ' . $images->count() . ' ảnh cần xóa.');
            
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

                $idsToDelete[] = $image->image_id; // Hoặc $image->id tùy model
            }

            // 1. Xóa R2 (Batch Delete - Tối đa 1000 key/request)
            if (!empty($s3KeysToDelete)) {
                // Chia nhỏ mảng nếu > 1000 item (giới hạn của S3)
                $chunks = array_chunk($s3KeysToDelete, 1000);
                foreach ($chunks as $chunk) {
                    try {
                        $s3->deleteObjects([
                            'Bucket' => $bucket,
                            'Delete' => ['Objects' => $chunk],
                        ]);
                        $this->info("Đã gửi lệnh xóa " . count($chunk) . " file trên R2.");
                    } catch (\Exception $e) {
                        $this->error("Lỗi xóa Batch R2: " . $e->getMessage());
                    }
                }
            }

            // 2. Xóa Local (Batch Delete)
            if (!empty($localFilesToDelete)) {
                Storage::disk('public')->delete($localFilesToDelete);
            }

            // 3. Xóa Database (1 Query duy nhất)
            ProductImage::whereIn('image_id', $idsToDelete)->delete();
            
            $this->info("Đã dọn sạch Database.");
        }

        // --- PHẦN 2: Quét file rác (Tối ưu thuật toán) ---
        $this->info('Đang quét file rác...');
        
        $files = Storage::disk('public')->files('temp_images');
        
        // Lấy TẤT CẢ temporary_url đang được sử dụng ra RAM (dạng Hash Map để tra cứu cực nhanh)
        // Thay vì query DB 1000 lần, ta chỉ query 1 lần.
        $activeFiles = ProductImage::whereNotNull('temporary_url')
            ->pluck('temporary_url')
            ->flip() // Đảo key-value để dùng isset() cho nhanh
            ->toArray();

        $filesToDelete = [];
        $now = time();
        $ttl = 24 * 60 * 60; 

        foreach ($files as $file) {
            if (str_ends_with($file, '.gitignore')) continue;

            // Kiểm tra nhanh trong RAM: File này có đang được dùng không?
            if (isset($activeFiles[$file])) {
                continue; // Đang dùng -> Bỏ qua ngay
            }

            // Nếu không dùng -> Kiểm tra thời gian
            $lastModified = Storage::disk('public')->lastModified($file);
            if (($now - $lastModified) > $ttl) {
                $filesToDelete[] = $file;
            }
        }

        // Xóa hàng loạt file rác
        if (!empty($filesToDelete)) {
            Storage::disk('public')->delete($filesToDelete);
            $this->info("Đã xóa " . count($filesToDelete) . " file rác.");
        } else {
            $this->info("Không có file rác nào.");
        }

        $duration = round(microtime(true) - $start, 2);
        $this->info("Hoàn tất trong {$duration} giây.");
    }
}
