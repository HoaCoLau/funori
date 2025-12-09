<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Funori Admin</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/admin.jsx'])
</head>
<body class="bg-gray-100">
    <div id="admin-root"></div>
</body>
</html>
