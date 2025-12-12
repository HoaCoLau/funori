import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Services/api';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../Components/Skeleton';

const AttributeList = () => {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState('');

    const fetchAttributes = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/attributes?page=${page}&search=${search}`);
            if (response.data.success) {
                // Check if data is wrapped in 'data' property (Resource Collection)
                const responseData = response.data.data;
                const items = Array.isArray(responseData) ? responseData : (responseData.data || []);
                setAttributes(items);

                // Handle pagination meta
                // If using Resource Collection -> response.data.meta or response.data.links
                // If using simple paginate -> response.data.pagination (custom) or root properties
                
                const meta = response.data.pagination || response.data.meta || responseData;
                
                setPagination({
                    current_page: meta.current_page || 1,
                    last_page: meta.last_page || 1,
                    total: meta.total || 0,
                    from: meta.from || 0,
                    to: meta.to || 0
                });
            }
        } catch (error) {
            console.error('Error fetching attributes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttributes();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchAttributes(1);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this attribute?')) {
            try {
                await api.delete(`/attributes/${id}`);
                toast.success('Attribute deleted successfully');
                fetchAttributes(pagination.current_page);
            } catch (error) {
                console.error('Error deleting attribute:', error);
                toast.error('Failed to delete attribute');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Attributes</h1>
                <Link
                    to="/attributes/create"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
                >
                    <Plus size={20} className="mr-2" />
                    Add Attribute
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search attributes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Values</th>
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
                            ) : attributes.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No attributes found</td>
                                </tr>
                            ) : (
                                attributes.map((attr) => (
                                    <tr key={attr.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{attr.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attr.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex flex-wrap gap-1">
                                                {attr.values && attr.values.slice(0, 5).map(val => (
                                                    <span key={val.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                        {val.name}
                                                    </span>
                                                ))}
                                                {attr.values && attr.values.length > 5 && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                        +{attr.values.length - 5} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                to={`/attributes/${attr.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(attr.id)}
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

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing {pagination.from} to {pagination.to} of {pagination.total} results
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => fetchAttributes(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            
                            {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                                .filter(page => {
                                    // Show first, last, current, and pages around current
                                    return (
                                        page === 1 ||
                                        page === pagination.last_page ||
                                        Math.abs(page - pagination.current_page) <= 1
                                    );
                                })
                                .map((page, index, array) => {
                                    // Add ellipsis
                                    const prevPage = array[index - 1];
                                    const showEllipsis = prevPage && page - prevPage > 1;

                                    return (
                                        <React.Fragment key={page}>
                                            {showEllipsis && <span className="px-2 py-2 text-gray-500">...</span>}
                                            <button
                                                onClick={() => fetchAttributes(page)}
                                                className={`px-3 py-1 border rounded ${
                                                    pagination.current_page === page
                                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                                        : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    );
                                })}

                            <button
                                onClick={() => fetchAttributes(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttributeList;
