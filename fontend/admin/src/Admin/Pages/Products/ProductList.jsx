import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../Services/api';
import { Plus, Edit, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../Components/Skeleton';

const ProductList = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Initialize from URL
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    
    const [pagination, setPagination] = useState({
        current_page: parseInt(searchParams.get('page') || '1'),
        last_page: 1,
        total: 0
    });

    // Sync Search Term to URL (Debounced)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const currentSearchInUrl = searchParams.get('search') || '';
            if (searchTerm !== currentSearchInUrl) {
                setSearchParams(prev => {
                    const newParams = new URLSearchParams(prev);
                    if (searchTerm) {
                        newParams.set('search', searchTerm);
                    } else {
                        newParams.delete('search');
                    }
                    newParams.set('page', '1'); // Reset to page 1 on new search
                    return newParams;
                });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Fetch Data when URL Params Change
    useEffect(() => {
        const page = searchParams.get('page') || 1;
        const search = searchParams.get('search') || '';
        fetchProducts(page, search);
    }, [searchParams]);

    const fetchProducts = async (page, search) => {
        setLoading(true);
        try {
            const response = await api.get('/products', {
                params: {
                    page: page,
                    search: search
                }
            });
            const responseData = response.data.data;
                
            
            const items = responseData.data || responseData; // Fallback if data is directly the array
            setProducts(Array.isArray(items) ? items : []);

            const meta = responseData.meta || responseData; // Fallback if meta info is at root
            
            setPagination({
                current_page: meta.current_page || 1,
                last_page: meta.last_page || 1,
                total: meta.total || 0
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setPagination({
                current_page: 1,
                last_page: 1,
                total: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                toast.success('Product deleted successfully');
                const page = searchParams.get('page') || 1;
                const search = searchParams.get('search') || '';
                fetchProducts(page, search);
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product');
            }
        }
    };

    const handleToggleStatus = async (product) => {
        const newStatus = !product.is_customizable;
        
        // Optimistic update: Update UI immediately
        setProducts(prev => prev.map(p => 
            p.id === product.id ? { ...p, is_customizable: newStatus } : p
        ));

        try {
            await api.put(`/products/${product.id}`, {
                is_customizable: newStatus
            });
            
            toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            // Revert on error
            setProducts(prev => prev.map(p => 
                p.id === product.id ? { ...p, is_customizable: !newStatus } : p
            ));
            console.error('Error updating product status:', error);
            toast.error('Failed to update product status');
        }
    };

    const handlePageChange = (newPage) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', newPage);
            return newParams;
        });
    };

    // if (loading && products.length === 0) return <div>Loading products...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <button 
                    onClick={() => navigate('/products/create')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
                >
                    <Plus size={20} className="mr-2" />
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products by name or SKU..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-8" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-10 w-10 rounded" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-48" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-24" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-16" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-6 w-16 rounded-full" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                                </tr>
                            ))
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                <img src={product.images[0].image_url} alt="" className="h-10 w-10 object-cover" />
                                            ) : (
                                                <span className="text-xs text-gray-400">No img</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.sku}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${Number(product.base_price).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleStatus(product)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                                product.is_customizable ? 'bg-indigo-600' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    product.is_customizable ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => navigate(`/products/edit/${product.id}`)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/products/${product.id}`)}
                                            className="text-gray-600 hover:text-gray-900"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing page <span className="font-medium">{pagination.current_page}</span> of <span className="font-medium">{pagination.last_page}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                        disabled={pagination.current_page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft size={16} />
                                    </button>
                                    
                                    {/* Simple pagination numbers */}
                                    {[...Array(pagination.last_page)].map((_, i) => {
                                        const page = i + 1;
                                        // Show first, last, current, and neighbors
                                        if (
                                            page === 1 ||
                                            page === pagination.last_page ||
                                            (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
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
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
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

export default ProductList;
