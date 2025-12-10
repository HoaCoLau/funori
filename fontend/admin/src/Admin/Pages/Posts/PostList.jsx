import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/api';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PostList = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPosts(1);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, statusFilter, categoryFilter]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/post-categories');
            if (response.data?.data?.data) {
                setCategories(response.data.data.data);
            } else if (response.data?.data) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPosts = async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page,
                search: searchTerm,
                status: statusFilter,
                category_id: categoryFilter
            };
            const response = await api.get('/posts', { params });
            
            let items = [];
            let meta = {};

            if (response.data?.data && Array.isArray(response.data.data)) {
                items = response.data.data;
                meta = response.data.meta || response.data;
            } else if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                 items = response.data.data.data;
                 meta = response.data.data;
            } else if (Array.isArray(response.data)) {
                items = response.data;
            }

            setPosts(items);
            
            setPagination({
                current_page: meta.current_page || 1,
                last_page: meta.last_page || 1,
                total: meta.total || 0
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/posts/${id}`);
                fetchPosts(pagination.current_page);
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Posts</h1>
                <button 
                    onClick={() => navigate('/posts/create')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Add Post
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex flex-col md:flex-row gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id || cat.post_category_id} value={cat.id || cat.post_category_id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : posts.length > 0 ? (
                                posts.map(post => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                                {post.featured_image ? (
                                                    <img src={post.featured_image} alt="" className="h-10 w-10 object-cover" />
                                                ) : (
                                                    <span className="text-xs text-gray-400">No img</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {post.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {post.category ? post.category.name : 'Uncategorized'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {post.author ? post.author.name : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${post.status === 'published' ? 'bg-green-100 text-green-800' : 
                                                  post.status === 'archived' ? 'bg-red-100 text-red-800' : 
                                                  'bg-gray-100 text-gray-800'}`}>
                                                {post.status ? post.status.charAt(0).toUpperCase() + post.status.slice(1) : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => navigate(`/posts/edit/${post.id}`)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(post.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No posts found</td>
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
                                        onClick={() => fetchPosts(pagination.current_page - 1)}
                                        disabled={pagination.current_page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft size={16} />
                                    </button>
                                    
                                    {[...Array(pagination.last_page)].map((_, i) => {
                                        const page = i + 1;
                                        if (
                                            page === 1 ||
                                            page === pagination.last_page ||
                                            (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => fetchPosts(page)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        page === pagination.current_page
                                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        } else if (
                                            page === pagination.current_page - 2 ||
                                            page === pagination.current_page + 2
                                        ) {
                                            return <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;
                                        }
                                        return null;
                                    })}

                                    <button
                                        onClick={() => fetchPosts(pagination.current_page + 1)}
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

export default PostList;
