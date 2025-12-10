import React, { useEffect, useState } from 'react';
import api from '../Services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        orders: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Fallback data for demo if API fails or not implemented yet
                setStats({
                    users: 1234,
                    orders: 567,
                    revenue: 89000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-500 text-sm font-medium">Total Users</h2>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-500 text-sm font-medium">Total Orders</h2>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-500 text-sm font-medium">Revenue</h2>
                    <p className="text-3xl font-bold text-gray-900 mt-2">${stats.revenue?.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
