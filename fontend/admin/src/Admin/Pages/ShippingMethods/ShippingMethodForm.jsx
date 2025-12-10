import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import { Save, ArrowLeft } from 'lucide-react';

const ShippingMethodForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        base_cost: '',
        description: '',
        is_active: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchMethod();
        }
    }, [id]);

    const fetchMethod = async () => {
        try {
            const response = await api.get(`/shipping-methods/${id}`);
            const data = response.data.data || response.data;
            setFormData({
                name: data.name,
                code: data.code,
                base_cost: data.base_cost,
                description: data.description || '',
                is_active: !!data.is_active
            });
        } catch (error) {
            console.error('Error fetching shipping method:', error);
            setError('Failed to load data');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditMode) {
                await api.put(`/shipping-methods/${id}`, formData);
            } else {
                await api.post('/shipping-methods', formData);
            }
            navigate('/shipping-methods');
        } catch (error) {
            console.error('Error saving shipping method:', error);
            setError(error.response?.data?.message || 'Failed to save shipping method');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate('/shipping-methods')}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Edit Shipping Method' : 'Create Shipping Method'}
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

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base Cost</label>
                            <input
                                type="number"
                                name="base_cost"
                                value={formData.base_cost}
                                onChange={handleChange}
                                required
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        ></textarea>
                    </div>

                    <div className="mb-6">
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

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/shipping-methods')}
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
                            {loading ? 'Saving...' : 'Save Method'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShippingMethodForm;
