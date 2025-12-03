<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;

class CleanupImages extends Command
{
    protected $signature = 'images:cleanup';
    protected $description = 'Xóa vĩnh viễn các ảnh có status là delete';

    public function handle()
    {
        // Lấy các ảnh đã đánh dấu xóa
        $images = ProductImage::where('status', 'delete')->get();

        if ($images->isEmpty()) {
            $this->info('Không có ảnh nào cần xóa.');
            return;
        }

        foreach ($images as $image) {
            // 1. Xóa file tạm trên Local (Nếu có)
            if ($image->temporary_url && Storage::disk('public')->exists($image->temporary_url)) {
                Storage::disk('public')->delete($image->temporary_url);
                $this->info("Đã xóa file local: {$image->temporary_url}");
            }

            // 2. (Tùy chọn) Gọi API sang Node.js để xóa file trên R2 nếu đã upload
            // if ($image->image_url) { ... call Node.js delete api ... }

            // 3. Xóa record trong DB vĩnh viễn
            $image->delete();
        }

        $this->info('Đã dọn dẹp xong ' . $images->count() . ' ảnh.');
    }
}
