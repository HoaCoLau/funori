import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../Services/api';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';

const AttributeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [formData, setFormData] = useState({
        attribute_name: '',
        values: []
    });

    useEffect(() => {
        if (isEditMode) {
            fetchAttribute();
        }
    }, [id]);

    const fetchAttribute = async () => {
        try {
            const response = await api.get(`/attributes/${id}`);
            if (response.data.success) {
                const attr = response.data.data;
                setFormData({
                    attribute_name: attr.name,
                    values: attr.values.map(v => ({
                        id: v.id,
                        value_name: v.name,
                        swatch_code: v.swatch_code || ''
                    }))
                });
            }
        } catch (error) {
            console.error('Error fetching attribute:', error);
            alert('Failed to load attribute details');
            navigate('/attributes');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleValueChange = (index, field, value) => {
        const newValues = [...formData.values];
        newValues[index][field] = value;
        setFormData(prev => ({ ...prev, values: newValues }));
    };

    const addValue = () => {
        setFormData(prev => ({
            ...prev,
            values: [...prev.values, { value_name: '', swatch_code: '' }]
        }));
    };

    const removeValue = (index) => {
        setFormData(prev => ({
            ...prev,
            values: prev.values.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                attribute_name: formData.attribute_name,
                values: formData.values.map(v => ({
                    ...(v.id ? { id: v.id } : {}),
                    value_name: v.value_name,
                    swatch_code: v.swatch_code
                }))
            };

            if (isEditMode) {
                await api.put(`/attributes/${id}`, payload);
            } else {
                await api.post('/attributes', payload);
            }
            navigate('/attributes');
        } catch (error) {
            console.error('Error saving attribute:', error);
            const message = error.response?.data?.message || 'Failed to save attribute';
            const errors = error.response?.data?.errors;
            
            if (errors) {
                const errorMessages = Object.values(errors).flat().join('\n');
                alert(`${message}\n${errorMessages}`);
            } else {
                alert(message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Link to="/attributes" className="mr-4 text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEditMode ? 'Edit Attribute' : 'Create Attribute'}
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-indigo-700 disabled:opacity-50"
                >
                    <Save size={20} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Attribute'}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attribute Name</label>
                    <input
                        type="text"
                        name="attribute_name"
                        value={formData.attribute_name}
                        onChange={handleChange}
                        placeholder="e.g. Color, Size, Material"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Attribute Values</h3>
                        <button
                            type="button"
                            onClick={addValue}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                        >
                            <Plus size={16} className="mr-1" /> Add Value
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.values.length === 0 && (
                            <p className="text-gray-500 text-sm italic text-center py-4">No values added yet.</p>
                        )}
                        
                        {formData.values.map((val, index) => (
                            <div key={index} className="flex items-start space-x-4 bg-gray-50 p-3 rounded-md">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Value Name</label>
                                    <input
                                        type="text"
                                        value={val.value_name}
                                        onChange={(e) => handleValueChange(index, 'value_name', e.target.value)}
                                        placeholder="e.g. Red, XL"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Swatch Code (Optional)</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={val.swatch_code}
                                            onChange={(e) => handleValueChange(index, 'swatch_code', e.target.value)}
                                            placeholder="#FF0000 or image url"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                        {val.swatch_code && val.swatch_code.startsWith('#') && (
                                            <div 
                                                className="w-9 h-9 rounded border border-gray-300 shadow-sm"
                                                style={{ backgroundColor: val.swatch_code }}
                                            ></div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeValue(index)}
                                    className="mt-6 text-red-500 hover:text-red-700 p-1"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttributeForm;
