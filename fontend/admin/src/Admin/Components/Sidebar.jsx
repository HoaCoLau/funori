import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Users, 
    Settings, 
    FileText, 
    Tag,
    Box,
    CreditCard,
    Layers,
    Palette,
    Sliders,
    Ticket,
    Star,
    Image,
    Truck,
    MessageSquare
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
    const location = useLocation();
    
    const menuItems = [
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/products', icon: <Box size={20} />, label: 'Products' },
        { path: '/attributes', icon: <Sliders size={20} />, label: 'Attributes' },
        { path: '/categories', icon: <Tag size={20} />, label: 'Categories' },
        { path: '/collections', icon: <Layers size={20} />, label: 'Collections' },
        { path: '/styles', icon: <Palette size={20} />, label: 'Styles' },
        { path: '/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
        { path: '/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/coupons', icon: <Ticket size={20} />, label: 'Coupons' },
        { path: '/reviews', icon: <Star size={20} />, label: 'Reviews' },
        { path: '/banners', icon: <Image size={20} />, label: 'Banners' },
        { path: '/posts', icon: <FileText size={20} />, label: 'Posts' },
        { path: '/post-categories', icon: <Tag size={20} />, label: 'Post Categories' },
        { path: '/shipping-methods', icon: <Truck size={20} />, label: 'Shipping Methods' },
        { path: '/payment-methods', icon: <CreditCard size={20} />, label: 'Payment Methods' },
        { path: '/contact-submissions', icon: <MessageSquare size={20} />, label: 'Contact' },
        { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <div className={`${isOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}>
            <div className="flex items-center justify-center h-16 border-b">
                <h1 className={`font-bold text-xl text-indigo-600 ${!isOpen && 'hidden'}`}>FUNORI</h1>
                <h1 className={`font-bold text-xl text-indigo-600 ${isOpen && 'hidden'}`}>F</h1>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link 
                                to={item.path} 
                                className={`flex items-center p-2 rounded-lg transition-colors ${
                                    location.pathname === item.path 
                                        ? 'bg-indigo-50 text-indigo-600' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                                }`}
                            >
                                <span className="flex-shrink-0">{item.icon}</span>
                                <span className={`ml-3 whitespace-nowrap ${!isOpen && 'hidden'}`}>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
