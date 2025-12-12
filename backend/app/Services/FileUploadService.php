<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    protected $uploadServiceUrl;
    protected $publicUrl;

    public function __construct()
    {
        // Use the internal docker network name 'upload-service'
        $this->uploadServiceUrl = 'http://upload-service:3000/internal/upload';
        $this->publicUrl = env('AWS_URL');
    }

    public function upload(UploadedFile $file)
    {
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid() . '.' . $extension;
        
        // Save to shared volume (storage/app/shared_uploads)
        Storage::disk('local')->putFileAs(
            'shared_uploads', 
            $file, 
            $filename
        );
        
        $response = Http::post($this->uploadServiceUrl, [
            'filename' => $filename,
            'originalName' => $file->getClientOriginalName(),
            'mimeType' => $file->getMimeType()
        ]);

        if ($response->successful()) {
            // Return the full public URL
            // The Node service uploads to 'uploads/' + filename
            return $this->publicUrl . '/uploads/' . $filename;
        }

        throw new \Exception('File upload failed: ' . $response->body());
    }
}
