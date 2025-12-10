import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/api';
import { Eye, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ContactSubmissionList = () => {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    useEffect(() => {
        fetchSubmissions(1);
    }, [statusFilter]);

    useEffect(() => {
        fetchSubmissions(pagination.current_page);
    }, [pagination.current_page]);

    const fetchSubmissions = async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page,
                search: searchTerm,
                status: statusFilter
            };
            const response = await api.get('/contact-submissions', { params });
            
            let items = [];
            let meta = {};

            if (response.data?.data?.data) {
                items = response.data.data.data;
                meta = response.data.data;
            } else if (response.data?.data) {
                items = response.data.data;
                meta = response.data;
            }

            setSubmissions(items);
            setPagination({
                current_page: meta.current_page || 1,
                last_page: meta.last_page || 1,
                total: meta.total || 0
            });
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSubmissions(1);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
            try {
                await api.delete(`/contact-submissions/${id}`);
                fetchSubmissions();
            } catch (error) {
                console.error('Error deleting submission:', error);
                alert('Failed to delete submission');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Contact Submissions</h1>
                
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Status</option>
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                    </select>

                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : submissions.length > 0 ? (
                                submissions.map(item => (
                                    <tr key={item.submission_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.submission_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.full_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.subject}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${item.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                                                  item.status === 'read' ? 'bg-yellow-100 text-yellow-800' : 
                                                  'bg-green-100 text-green-800'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => navigate(`/contact-submissions/${item.submission_id}`)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.submission_id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No submissions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing page <span className="font-medium">{pagination.current_page}</span> of <span className="font-medium">{pagination.last_page}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                                        disabled={pagination.current_page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
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
                )}
            </div>
        </div>
    );
};

export default ContactSubmissionList;
