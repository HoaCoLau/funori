<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $sevenDaysAgo = Carbon::now()->subDays(6);

        // 1. Revenue Stats (Only count 'Delivered' orders)
        $revenueToday = Order::where('status', 'Delivered')
            ->whereDate('order_date', $today)
            ->sum('total_amount');

        $revenueMonth = Order::where('status', 'Delivered')
            ->whereDate('order_date', '>=', $startOfMonth)
            ->sum('total_amount');

        $totalRevenue = Order::where('status', 'Delivered')
            ->sum('total_amount');

        // 2. Order Stats
        $newOrdersCount = Order::where('status', 'Pending')->count();
        $totalOrdersCount = Order::count();
        $ordersTodayCount = Order::whereDate('order_date', $today)->count();

        // 3. Product/Inventory Stats
        // Count variants with stock < 10
        $lowStockCount = ProductVariant::where('stock_quantity', '<', 10)->count();

        // 4. Customer Stats
        $totalCustomers = User::where('role_id', 2)->count();

        // 5. Revenue Chart (Last 7 Days)
        // We need to ensure all 7 days are present even if 0 revenue
        $revenueChart = [];
        
        // Note: DB::raw('DATE(order_date)') works for MySQL.
        $ordersChart = Order::where('status', 'Delivered')
            ->whereDate('order_date', '>=', $sevenDaysAgo)
            ->select(
                DB::raw('DATE(order_date) as date'),
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        for ($i = 0; $i < 7; $i++) {
            $date = $sevenDaysAgo->copy()->addDays($i)->format('Y-m-d');
            $revenueChart[] = [
                'date' => $date,
                'total' => isset($ordersChart[$date]) ? (float) $ordersChart[$date]->total : 0
            ];
        }

        // 6. Recent Orders (Top 5)
        $recentOrders = Order::with('user:user_id,first_name,last_name')
            ->orderBy('order_date', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'revenue' => [
                    'today' => (float) $revenueToday,
                    'month' => (float) $revenueMonth,
                    'total' => (float) $totalRevenue,
                ],
                'orders' => [
                    'new' => $newOrdersCount,
                    'total' => $totalOrdersCount,
                    'today' => $ordersTodayCount,
                ],
                'inventory' => [
                    'low_stock_variants' => $lowStockCount,
                ],
                'customers' => [
                    'total' => $totalCustomers,
                ],
                'charts' => [
                    'revenue_last_7_days' => $revenueChart,
                ],
                'recent_orders' => $recentOrders,
            ]
        ]);
    }
}
