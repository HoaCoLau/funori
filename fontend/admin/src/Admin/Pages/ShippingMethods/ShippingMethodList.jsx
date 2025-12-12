import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../Components/Skeleton';

const ShippingMethodList = () => {
    const navigate = useNavigate();
    const [methods, setMethods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMethods();
    }, []);

    const fetchMethods = async () => {
        setLoading(true);
        try {
            const response = await api.get('/shipping-methods');
            // The API returns { success: true, data: { data: [...] } }
            // So we need to access response.data.data.data
            if (response.data?.data?.data) {
                setMethods(response.data.data.data);
            } else {
                setMethods(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching shipping methods:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this shipping method?')) {
            try {
                await api.delete(`/shipping-methods/${id}`);
                toast.success('Shipping method deleted successfully');
                fetchMethods();
            } catch (error) {
                console.error('Error deleting shipping method:', error);
                toast.error('Failed to delete shipping method');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Shipping Methods</h1>
                <button 
                    onClick={() => navigate('/shipping-methods/create')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Add Method
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-8" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-32" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-24" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-16" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-16" /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                                </tr>
                            ))
                        ) : methods.length > 0 ? (
                            methods.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.base_cost}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => navigate(`/shipping-methods/edit/${item.id}`)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No shipping methods found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShippingMethodList;
