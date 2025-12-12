import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import { Save, ArrowLeft, Upload } from 'lucide-react';

const BannerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        is_active: true,
        order: 0,
        image_id: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchBanner();
        }
    }, [id]);

    const fetchBanner = async () => {
        try {
            const response = await api.get(`/banners/${id}`);
            const banner = response.data.data;
            setFormData({
                title: banner.title,
                link: banner.link,
                is_active: banner.is_active,
                order: banner.order,
                image_id: banner.image_id
            });
            if (banner.image_url) {
                setImagePreview(banner.image_url);
            }
        } catch (error) {
            console.error('Error fetching banner:', error);
            setError('Failed to load banner data');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            // Assuming there's an upload endpoint that returns image_id and url
            // Adjust this based on your actual upload logic
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setFormData(prev => ({ ...prev, image_id: response.data.id }));
            setImagePreview(URL.createObjectURL(file));
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditMode) {
                await api.put(`/banners/${id}`, formData);
            } else {
                await api.post('/banners', formData);
            }
            navigate('/banners');
        } catch (error) {
            console.error('Error saving banner:', error);
            setError(error.response?.data?.message || 'Failed to save banner');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate('/banners')}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Edit Banner' : 'Create Banner'}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                        <input
                            type="text"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                        <div className="flex items-center space-x-4">
                            <div className="h-32 w-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-gray-400">No image</span>
                                )}
                            </div>
                            <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <Upload size={16} className="inline mr-2" />
                                Upload
                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/banners')}
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
                            {loading ? 'Saving...' : 'Save Banner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BannerForm;
