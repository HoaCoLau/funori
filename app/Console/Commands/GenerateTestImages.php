<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

// test corn job
class GenerateTestImages extends Command
{
    // Thêm option --trash
    protected $signature = 'test:gen-images {count=50} {--trash : Tạo file rác (không lưu DB và set thời gian về quá khứ)}';
    protected $description = 'Tạo dữ liệu giả để test Worker hoặc test dọn dẹp rác';

    public function handle()
    {
        $count = $this->argument('count');
        $isTrash = $this->option('trash');

        if ($isTrash) {
            $this->info("Đang tạo $count ẢNH RÁC (Orphan files) - Thời gian lùi về 2 ngày trước...");
        } else {
            $this->info("Đang tạo $count ảnh hợp lệ để test Worker...");
        }

        // Đảm bảo thư mục temp_images tồn tại
        if (!Storage::disk('public')->exists('temp_images')) {
            Storage::disk('public')->makeDirectory('temp_images');
        }

        // Kiểm tra file mẫu
        if (!Storage::disk('public')->exists('sample.jpg')) {
            $this->info("Đang tải ảnh mẫu từ Internet (Picsum)...");
            try {
                $ctx = stream_context_create(['http' => ['timeout' => 5]]);
                $contents = @file_get_contents('https://picsum.photos/600/600', false, $ctx);
                
                if ($contents) {
                    Storage::disk('public')->put('sample.jpg', $contents);
                } else {
                    throw new \Exception("Empty content");
                }
            } catch (\Exception $e) {
                $this->warn("Không tải được ảnh. Tạo file dummy.");
                Storage::disk('public')->put('sample.jpg', 'DUMMY CONTENT');
            }
        }

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        for ($i = 0; $i < $count; $i++) {
            $fileName = Str::random(40) . '.jpg';
            $tempName = 'temp_images/' . $fileName;
            
            // 1. Copy ra file tạm mới
            Storage::disk('public')->copy('sample.jpg', $tempName);

            if ($isTrash) {
                // --- LOGIC TẠO RÁC ---
                // Không lưu vào DB
                
                // Hack thời gian: Chỉnh sửa thời gian file lùi về 48 tiếng trước
                // Để lệnh cleanup (thường xóa file > 24h) có thể xóa được ngay
                $fullPath = Storage::disk('public')->path($tempName);
                if (file_exists($fullPath)) {
                    touch($fullPath, time() - (48 * 60 * 60)); // Lùi 48h
                }
            } else {
                // --- LOGIC BÌNH THƯỜNG ---
                ProductImage::create([
                    'product_id' => 1, 
                    'image_url' => null,
                    'temporary_url' => $tempName,
                    'status' => 'temporary',
                    'alt_text' => "Stress Test $i",
                    'sort_order' => 0,
                    'is_thumbnail' => 0
                ]);
            }
            
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        
        if ($isTrash) {
            $this->info("Đã tạo xong ảnh rác! Hãy chạy lệnh 'php artisan images:cleanup' để kiểm tra xem chúng có bị xóa không.");
        } else {
            $this->info("Đã xong! Hãy xem log Worker.");
        }
    }
}






















// test ảnh worker
// class GenerateTestImages extends Command
// {
//     protected $signature = 'test:gen-images {count=50}';
//     protected $description = 'Tạo dữ liệu giả để test Worker';

//     public function handle()
//     {
//         $count = $this->argument('count');
//         $this->info("Đang tạo $count ảnh giả lập...");

//         // Đảm bảo thư mục temp_images tồn tại
//         if (!Storage::disk('public')->exists('temp_images')) {
//             Storage::disk('public')->makeDirectory('temp_images');
//         }

//         // Kiểm tra file mẫu
//         if (!Storage::disk('public')->exists('sample.jpg')) {
//             $this->info("Đang tải ảnh mẫu từ Internet (Picsum)...");
//             try {
//                 // Tải ảnh thật từ Picsum (Random ảnh 600x600)
//                 $contents = file_get_contents('https://picsum.photos/600/600');
//                 if ($contents) {
//                     Storage::disk('public')->put('sample.jpg', $contents);
//                     $this->info("Đã tải xong sample.jpg");
//                 } else {
//                     throw new \Exception("Empty content");
//                 }
//             } catch (\Exception $e) {
//                 $this->warn("Không tải được ảnh: " . $e->getMessage());
//                 $this->warn("Tạo file dummy thay thế.");
//                 Storage::disk('public')->put('sample.jpg', 'DUMMY CONTENT FOR TESTING');
//             }
//         }

//         $bar = $this->output->createProgressBar($count);
//         $bar->start();

//         for ($i = 0; $i < $count; $i++) {
//             // 1. Copy ra file tạm mới
//             $tempName = 'temp_images/' . Str::random(40) . '.jpg';
//             Storage::disk('public')->copy('sample.jpg', $tempName);

//             // 2. Insert vào DB
//             // Lưu ý: product_id = 1 phải tồn tại trong DB của bạn. Nếu không, hãy sửa số này.
//             ProductImage::create([
//                 'product_id' => 1, 
//                 'image_url' => null,
//                 'temporary_url' => $tempName,
//                 'status' => 'temporary',
//                 'alt_text' => "Stress Test $i",
//                 'sort_order' => 0,
//                 'is_thumbnail' => 0
//             ]);
            
//             $bar->advance();
//         }

//         $bar->finish();
//         $this->newLine();
//         $this->info("Đã xong! Hãy xem log Worker để thấy nó xử lý.");
//     }
// }
