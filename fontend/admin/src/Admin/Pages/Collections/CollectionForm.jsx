import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import { Save, ArrowLeft, Upload, X, Search, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../Components/Skeleton';

const CollectionForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const dropdownRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [styles, setStyles] = useState([]);
    
    // Style Search State
    const [styleSearchTerm, setStyleSearchTerm] = useState('');
    const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);
    const [isSearchingStyles, setIsSearchingStyles] = useState(false);

    const [formData, setFormData] = useState({
        collection_name: '',
        style_id: '',
        description: '',
        lifestyle_image: null,
        preview_url: null
    });

    useEffect(() => {
        if (isEditMode) {
            fetchCollection();
        } else {
            fetchStyles();
        }

        // Click outside to close dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsStyleDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [id]);

    // Debounce search for styles
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (styleSearchTerm) {
                fetchStyles(styleSearchTerm);
            } else {
                fetchStyles();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [styleSearchTerm]);

    const fetchStyles = async (search = '') => {
        setIsSearchingStyles(true);
        try {
            const response = await api.get(`/styles?search=${search}`);
            // Handle paginated response structure
            const stylesData = response.data.data.data || response.data.data;
            setStyles(Array.isArray(stylesData) ? stylesData : []);
        } catch (error) {
            console.error('Error fetching styles:', error);
            setStyles([]);
        } finally {
            setIsSearchingStyles(false);
        }
    };

    const fetchCollection = async () => {
        try {
            const response = await api.get(`/collections/${id}`);
            const collection = response.data.data;
            
            setFormData({
                collection_name: collection.name,
                style_id: collection.style_id || '',
                description: collection.description || '',
                lifestyle_image: collection.image, // Existing URL
                preview_url: collection.image
            });

            if (collection.style_name) {
                setStyleSearchTerm(collection.style_name);
            }
        } catch (error) {
            console.error('Error fetching collection:', error);
            navigate('/collections');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleStyleSelect = (style) => {
        setFormData(prev => ({ ...prev, style_id: style.style_id }));
        setStyleSearchTerm(style.style_name);
        setIsStyleDropdownOpen(false);
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
                lifestyle_image: file,
                preview_url: URL.createObjectURL(file)
            }));
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            lifestyle_image: null,
            preview_url: null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('collection_name', formData.collection_name);
            if (formData.style_id) data.append('style_id', formData.style_id);
            if (formData.description) data.append('description', formData.description);
            
            if (formData.lifestyle_image instanceof File) {
                data.append('lifestyle_image', formData.lifestyle_image);
            }

            if (isEditMode) {
                data.append('_method', 'PUT');
                await api.post(`/collections/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Collection updated successfully');
            } else {
                await api.post('/collections', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Collection created successfully');
            }

            navigate('/collections');
        } catch (error) {
            console.error('Error saving collection:', error);
            toast.error(error.response?.data?.message || 'Failed to save collection');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Skeleton className="w-8 h-8 mr-4 rounded" />
                        <Skeleton className="h-8 w-48" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="grid grid-cols-1 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i}>
                                <Skeleton className="h-5 w-32 mb-1" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate('/collections')} className="mr-4 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Collection' : 'Add Collection'}</h1>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-indigo-700 disabled:opacity-50"
                >
                    <Save size={20} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Collection'}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Collection Name</label>
                        <input
                            type="text"
                            name="collection_name"
                            value={formData.collection_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search and select a style..."
                                value={styleSearchTerm}
                                onChange={(e) => {
                                    setStyleSearchTerm(e.target.value);
                                    setIsStyleDropdownOpen(true);
                                    if (!e.target.value) {
                                        setFormData(prev => ({ ...prev, style_id: '' }));
                                    }
                                }}
                                onFocus={() => setIsStyleDropdownOpen(true)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                {isSearchingStyles ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                                ) : (
                                    <ChevronDown size={16} className="text-gray-400" />
                                )}
                            </div>
                        </div>

                        {isStyleDropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {styles.length === 0 ? (
                                    <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                                        No styles found.
                                    </div>
                                ) : (
                                    styles.map((style) => (
                                        <div
                                            key={style.style_id}
                                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 ${
                                                formData.style_id === style.style_id ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'
                                            }`}
                                            onClick={() => handleStyleSelect(style)}
                                        >
                                            <span className={`block truncate ${formData.style_id === style.style_id ? 'font-semibold' : 'font-normal'}`}>
                                                {style.style_name}
                                            </span>
                                            {style.style_description && (
                                                <span className="block text-xs text-gray-500 truncate">
                                                    {style.style_description}
                                                </span>
                                            )}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lifestyle Image</label>
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

export default CollectionForm;
