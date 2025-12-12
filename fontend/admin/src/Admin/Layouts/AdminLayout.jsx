import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import Breadcrumbs from '../Components/Breadcrumbs';
import { useAuth } from '../Context/AuthContext';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen bg-gray-100">
            <Toaster position="top-right" />
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                    user={user}
                    onLogout={logout}
                />
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Breadcrumbs />
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
