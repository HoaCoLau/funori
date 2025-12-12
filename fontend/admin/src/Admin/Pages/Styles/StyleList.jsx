import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/api';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../Components/Skeleton';

const StyleList = () => {
    const navigate = useNavigate();
    const [styles, setStyles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchStyles(1, searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchStyles = async (page = 1, search = searchTerm) => {
        setLoading(true);
        try {
            const response = await api.get(`/styles?page=${page}&search=${search}`);
            const responseData = response.data.data;
            
            setStyles(responseData.data || []);
            setPagination({
                current_page: responseData.meta?.current_page || 1,
                last_page: responseData.meta?.last_page || 1,
                total: responseData.meta?.total || 0
            });
        } catch (error) {
            console.error('Error fetching styles:', error);
            setStyles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this style?')) {
            try {
                await api.delete(`/styles/${id}`);
                toast.success('Style deleted successfully');
                fetchStyles(pagination.current_page, searchTerm);
            } catch (error) {
                console.error('Error deleting style:', error);
                toast.error('Failed to delete style');
            }
        }
    };

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center h-64">
    //             <div className="text-lg text-gray-600">Loading...</div>
    //         </div>
    //     );
    // }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Styles</h1>
                <button
                    onClick={() => navigate('/styles/create')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Add Style
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search styles..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-8" /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-32" /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-48" /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : styles.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No styles found
                                    </td>
                                </tr>
                            ) : (
                                styles.map((style) => (
                                    <tr key={style.style_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {style.style_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{style.style_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {style.style_description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => navigate(`/styles/edit/${style.style_id}`)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(style.style_id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{pagination.current_page}</span> of <span className="font-medium">{pagination.last_page}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => fetchStyles(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft size={16} />
                                </button>

                                {/* Page Numbers */}
                                {(() => {
                                    const pages = [];
                                    const { current_page, last_page } = pagination;
                                    
                                    // Logic to show limited page numbers
                                    const delta = 2;
                                    const left = current_page - delta;
                                    const right = current_page + delta + 1;
                                    const range = [];
                                    const rangeWithDots = [];
                                    let l;

                                    for (let i = 1; i <= last_page; i++) {
                                        if (i === 1 || i === last_page || (i >= left && i < right)) {
                                            range.push(i);
                                        }
                                    }

                                    for (let i of range) {
                                        if (l) {
                                            if (i - l === 2) {
                                                rangeWithDots.push(l + 1);
                                            } else if (i - l !== 1) {
                                                rangeWithDots.push('...');
                                            }
                                        }
                                        rangeWithDots.push(i);
                                        l = i;
                                    }

                                    return rangeWithDots.map((page, index) => {
                                        if (page === '...') {
                                            return (
                                                <span key={`dots-${index}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => fetchStyles(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    page === current_page
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    });
                                })()}

                                <button
                                    onClick={() => fetchStyles(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight size={16} />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StyleList;
