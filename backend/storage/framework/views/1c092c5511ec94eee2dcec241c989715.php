<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Funori Admin</title>
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/admin.jsx']); ?>
</head>
<body class="bg-gray-100">
    <div id="admin-root"></div>
</body>
</html>
<?php /**PATH /var/www/html/resources/views/admin/app.blade.php ENDPATH**/ ?>