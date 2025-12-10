import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import { Save, ArrowLeft } from 'lucide-react';

const PostCategoryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    
    const [formData, setFormData] = useState({
        name: '',
        parent_id: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/post-categories');
            let items = [];
            if (response.data?.data && Array.isArray(response.data.data)) {
                items = response.data.data;
            } else if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                 items = response.data.data.data;
            } else if (Array.isArray(response.data)) {
                items = response.data;
            }
            setCategories(items);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCategory = async () => {
        try {
            const response = await api.get(`/post-categories/${id}`);
            const category = response.data?.data || response.data;
            setFormData({
                name: category.name,
                parent_id: category.parent_id || ''
            });
        } catch (error) {
            console.error('Error fetching category:', error);
            setError('Failed to load category data');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditMode) {
                await api.put(`/post-categories/${id}`, formData);
            } else {
                await api.post('/post-categories', formData);
            }
            navigate('/post-categories');
        } catch (error) {
            console.error('Error saving category:', error);
            setError(error.response?.data?.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate('/post-categories')}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Edit Post Category' : 'Create Post Category'}
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                        <select
                            name="parent_id"
                            value={formData.parent_id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">None</option>
                            {categories
                                .filter(cat => cat.post_category_id != id && cat.id != id) // Prevent selecting self as parent
                                .map(cat => (
                                    <option key={cat.post_category_id || cat.id} value={cat.post_category_id || cat.id}>
                                        {cat.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/post-categories')}
                            className="mr-4 px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            <Save size={20} className="mr-2" />
                            {loading ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostCategoryForm;
