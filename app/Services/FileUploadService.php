<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class FileUploadService
{
    protected $uploadServiceUrl;
    protected $publicUrl;

    public function __construct()
    {
        // Use the internal docker network name 'upload-service'
        $this->uploadServiceUrl = 'http://upload-service:3000/upload';
        $this->publicUrl = env('AWS_URL');
    }

    public function upload(UploadedFile $file)
    {
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid() . '.' . $extension;
        
        $response = Http::attach(
            'file', file_get_contents($file->getPathname()), $file->getClientOriginalName()
        )->post($this->uploadServiceUrl . '?customFilename=' . $filename);

        if ($response->successful()) {
            // Return the full public URL
            // The Node service uploads to 'uploads/' + filename
            return $this->publicUrl . '/uploads/' . $filename;
        }

        throw new \Exception('File upload failed: ' . $response->body());
    }
}
