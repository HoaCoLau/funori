<?php

$modelsDir = __DIR__ . '/app/Models';
$files = glob($modelsDir . '/*.php');

foreach ($files as $file) {
    $content = file_get_contents($file);
    
    // Skip if already has HasFactory
    if (strpos($content, 'use Illuminate\Database\Eloquent\Factories\HasFactory;') !== false) {
        continue;
    }
    
    // Add HasFactory import
    $content = str_replace(
        'use Illuminate\Database\Eloquent\Model;',
        'use Illuminate\Database\Eloquent\Factories\HasFactory;' . "\n" . 'use Illuminate\Database\Eloquent\Model;',
        $content
    );
    
    // Add HasFactory trait
    $content = preg_replace(
        '/class (\w+) extends Model\s*\{/',
        'class $1 extends Model' . "\n" . '{' . "\n" . '    use HasFactory;',
        $content
    );
    
    // Remove duplicate opening braces
    $content = str_replace("    use HasFactory;\n{", "    use HasFactory;", $content);
    
    file_put_contents($file, $content);
    echo "Updated: " . basename($file) . "\n";
}

echo "Done!\n";
