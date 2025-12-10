import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import { Save, ArrowLeft } from 'lucide-react';

const StyleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    
    const [formData, setFormData] = useState({
        style_name: '',
        style_description: ''
    });

    useEffect(() => {
        if (isEditMode) {
            fetchStyle();
        }
    }, [id]);

    const fetchStyle = async () => {
        try {
            const response = await api.get(`/styles/${id}`);
            const style = response.data.data;
            
            setFormData({
                style_name: style.style_name,
                style_description: style.style_description || ''
            });
        } catch (error) {
            console.error('Error fetching style:', error);
            navigate('/styles');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                await api.put(`/styles/${id}`, formData);
            } else {
                await api.post('/styles', formData);
            }

            navigate('/styles');
        } catch (error) {
            console.error('Error saving style:', error);
            alert(error.response?.data?.message || 'Failed to save style');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate('/styles')} className="mr-4 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Style' : 'Add Style'}</h1>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-indigo-700 disabled:opacity-50"
                >
                    <Save size={20} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Style'}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Style Name</label>
                        <input
                            type="text"
                            name="style_name"
                            value={formData.style_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="style_description"
                            rows="4"
                            value={formData.style_description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StyleForm;
