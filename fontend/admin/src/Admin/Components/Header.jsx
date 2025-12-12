import React, { useState } from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';

const Header = ({ toggleSidebar, user, onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between h-16 px-6">
                <div className="flex items-center">
                    <button 
                        onClick={toggleSidebar}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <Menu size={24} />
                    </button>
                </div>
                
                <div className="flex items-center space-x-4">
                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                        <Bell size={20} />
                    </button>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-2 focus:outline-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <User size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                <button
                                    onClick={onLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
