import React, { useEffect, useState } from 'react';
import api from '../Services/api';
import { 
    DollarSign, 
    ShoppingBag, 
    Users, 
    AlertTriangle, 
    TrendingUp,
    Package,
    Clock
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!stats) return <div>Error loading dashboard data.</div>;

    // Format chart data
    const chartData = stats.charts.revenue_last_7_days.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: item.total
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                ${stats.revenue.total.toLocaleString()}
                            </h3>
                            <div className="flex items-center mt-2 text-sm">
                                <span className="text-green-600 flex items-center font-medium">
                                    <TrendingUp size={16} className="mr-1" />
                                    +${stats.revenue.today.toLocaleString()}
                                </span>
                                <span className="text-gray-400 ml-2">today</span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">New Orders</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {stats.orders.new}
                            </h3>
                            <div className="flex items-center mt-2 text-sm">
                                <span className="text-blue-600 font-medium">
                                    {stats.orders.today} orders
                                </span>
                                <span className="text-gray-400 ml-2">today</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <ShoppingBag className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Customers Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Customers</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {stats.customers.total}
                            </h3>
                            <p className="text-sm text-gray-400 mt-2">Active users</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <Users className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Low Stock Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {stats.inventory.low_stock_variants}
                            </h3>
                            <p className="text-sm text-red-500 mt-2 font-medium">Needs attention</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                            <AlertTriangle className="text-red-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Revenue Overview</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#6B7280', fontSize: 12}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#6B7280', fontSize: 12}}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    formatter={(value) => [`$${value}`, 'Revenue']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke="#3B82F6" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorRevenue)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
                    <div className="space-y-4">
                        {stats.recent_orders.length > 0 ? (
                            stats.recent_orders.map((order) => (
                                <div key={order.order_id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gray-100 rounded-full">
                                            <Package size={18} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Order #{order.order_id}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.user ? `${order.user.first_name} ${order.user.last_name}` : 'Guest'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">
                                            ${parseFloat(order.total_amount).toLocaleString()}
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                No recent orders found
                            </div>
                        )}
                    </div>
                    <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                        View All Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
