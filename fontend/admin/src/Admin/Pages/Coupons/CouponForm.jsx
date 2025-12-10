import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import { Save, ArrowLeft } from 'lucide-react';

const CouponForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    
    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        start_date: '',
        end_date: '',
        usage_limit: '',
        min_order_value: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchCoupon();
        }
    }, [id]);

    const fetchCoupon = async () => {
        try {
            const response = await api.get(`/coupons/${id}`);
            const coupon = response.data.data;
            setFormData({
                code: coupon.code,
                discount_type: coupon.discount_type,
                discount_value: coupon.discount_value,
                start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
                end_date: coupon.end_date ? coupon.end_date.split('T')[0] : '',
                usage_limit: coupon.usage_limit || '',
                min_order_value: coupon.min_order_value || ''
            });
        } catch (error) {
            console.error('Error fetching coupon:', error);
            setError('Failed to load coupon data');
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
                await api.put(`/coupons/${id}`, formData);
            } else {
                await api.post('/coupons', formData);
            }
            navigate('/coupons');
        } catch (error) {
            console.error('Error saving coupon:', error);
            setError(error.response?.data?.message || 'Failed to save coupon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate('/coupons')}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Edit Coupon' : 'Create Coupon'}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                            <select
                                name="discount_type"
                                value={formData.discount_type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                            <input
                                type="number"
                                name="discount_value"
                                value={formData.discount_value}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                            <input
                                type="number"
                                name="usage_limit"
                                value={formData.usage_limit}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Value</label>
                            <input
                                type="number"
                                name="min_order_value"
                                value={formData.min_order_value}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/coupons')}
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
                            {loading ? 'Saving...' : 'Save Coupon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CouponForm;
