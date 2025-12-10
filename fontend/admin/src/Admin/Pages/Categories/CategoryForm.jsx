import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import { Save, ArrowLeft, Upload, X, Search, ChevronDown } from 'lucide-react';

const CategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const dropdownRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [categories, setCategories] = useState([]);
    
    // Parent Category Search State
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isSearchingCategories, setIsSearchingCategories] = useState(false);

    const [formData, setFormData] = useState({
        category_name: '',
        parent_id: '',
        description: '',
        category_image: null,
        preview_url: null
    });

    useEffect(() => {
        if (isEditMode) {
            fetchCategory();
        } else {
            fetchCategories();
        }

        // Click outside to close dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [id]);

    // Debounce search for categories
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (categorySearchTerm) {
                fetchCategories(categorySearchTerm);
            } else {
                fetchCategories();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [categorySearchTerm]);

    const fetchCategories = async (search = '') => {
        setIsSearchingCategories(true);
        try {
            const response = await api.get(`/categories?search=${search}`);
            const categoriesData = response.data.data.data || response.data.data;
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setIsSearchingCategories(false);
        }
    };

    const fetchCategory = async () => {
        try {
            const response = await api.get(`/categories/${id}`);
            const category = response.data.data;
            
            setFormData({
                category_name: category.name,
                parent_id: category.parent_id || '',
                description: category.description || '',
                category_image: category.image_url, // Existing URL
                preview_url: category.image_url
            });

            if (category.parent_name) {
                setCategorySearchTerm(category.parent_name);
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            navigate('/categories');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleCategorySelect = (category) => {
        setFormData(prev => ({ ...prev, parent_id: category.id }));
        setCategorySearchTerm(category.name);
        setIsCategoryDropdownOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                category_image: file,
                preview_url: URL.createObjectURL(file)
            }));
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            category_image: null,
            preview_url: null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('category_name', formData.category_name);
            if (formData.parent_id) data.append('parent_id', formData.parent_id);
            if (formData.description) data.append('description', formData.description);
            
            if (formData.category_image instanceof File) {
                data.append('category_image', formData.category_image);
            }

            if (isEditMode) {
                data.append('_method', 'PUT');
                await api.post(`/categories/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/categories', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            navigate('/categories');
        } catch (error) {
            console.error('Error saving category:', error);
            alert(error.response?.data?.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate('/categories')} className="mr-4 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Category' : 'Add Category'}</h1>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-indigo-700 disabled:opacity-50"
                >
                    <Save size={20} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Category'}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input
                            type="text"
                            name="category_name"
                            value={formData.category_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search and select a parent category..."
                                value={categorySearchTerm}
                                onChange={(e) => {
                                    setCategorySearchTerm(e.target.value);
                                    setIsCategoryDropdownOpen(true);
                                    if (!e.target.value) {
                                        setFormData(prev => ({ ...prev, parent_id: '' }));
                                    }
                                }}
                                onFocus={() => setIsCategoryDropdownOpen(true)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                {isSearchingCategories ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                                ) : (
                                    <ChevronDown size={16} className="text-gray-400" />
                                )}
                            </div>
                        </div>

                        {isCategoryDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                <div
                                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 text-gray-900 font-medium border-b border-gray-100"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, parent_id: '' }));
                                        setCategorySearchTerm('');
                                        setIsCategoryDropdownOpen(false);
                                    }}
                                >
                                    None (Top Level)
                                </div>
                                {categories.length === 0 ? (
                                    <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                                        No categories found.
                                    </div>
                                ) : (
                                    categories
                                        .filter(c => c.id !== parseInt(id)) // Prevent selecting self as parent
                                        .map((category) => (
                                            <div
                                                key={category.id}
                                                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 ${
                                                    formData.parent_id === category.id ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'
                                                }`}
                                                onClick={() => handleCategorySelect(category)}
                                            >
                                                <span className={`block truncate ${formData.parent_id === category.id ? 'font-semibold' : 'font-normal'}`}>
                                                    {category.name}
                                                </span>
                                            </div>
                                        ))
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <div className="mt-1 flex items-center space-x-4">
                            <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden relative bg-gray-50">
                                {formData.preview_url ? (
                                    <>
                                        <img src={formData.preview_url} alt="Preview" className="h-full w-full object-cover" />
                                        <button 
                                            onClick={removeImage}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-gray-400 text-xs">No Image</span>
                                )}
                            </div>
                            <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <Upload size={16} className="inline mr-2" />
                                Upload Image
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;
