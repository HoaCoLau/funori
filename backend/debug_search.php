<?php

use App\Models\Product;
use Illuminate\Support\Facades\DB;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// 1. Check the specific product
$product = Product::where('sku', 'ANKER-001')->first();
echo "Product found by SKU 'ANKER-001':\n";
if ($product) {
    echo "ID: " . $product->id . "\n";
    echo "Name: '" . $product->name . "'\n";
    echo "SKU: '" . $product->sku . "'\n";
} else {
    echo "Not found.\n";
}

echo "\n--------------------------------\n";

// 2. Test the search logic
$searchTerm = 'anker';
echo "Testing search with term: '$searchTerm'\n";

DB::enableQueryLog();

$results = Product::where(function($q) use ($searchTerm) {
    $q->whereRaw('LOWER(name) LIKE ?', ["%{$searchTerm}%"])
      ->orWhereRaw('LOWER(sku) LIKE ?', ["%{$searchTerm}%"]);
})->get();

echo "Found " . $results->count() . " products.\n";

$log = DB::getQueryLog();
echo "SQL Query executed:\n";
print_r($log);

foreach ($results as $p) {
    echo "- " . $p->name . " (" . $p->sku . ")\n";
}
