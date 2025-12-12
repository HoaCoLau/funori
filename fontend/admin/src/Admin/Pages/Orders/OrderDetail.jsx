import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../Components/Skeleton';

const OrderDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/orders/${id}`);
            const data = response.data.data;
            setOrder(data);
            setStatus(data.status);
        } catch (error) {
            console.error('Error fetching order:', error);
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async () => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            toast.success('Order status updated successfully');
            fetchOrder();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    if (loading) return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
    if (!order) return <div className="p-6">Order not found</div>;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button 
                        onClick={() => navigate('/orders')}
                        className="mr-4 text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                        onClick={handleStatusChange}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Update Status
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                    <th className="text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {order.items && order.items.map(item => (
                                    <tr key={item.id}>
                                        <td className="py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                    {item.product && item.product.image_url ? (
                                                        <img src={item.product.image_url} alt="" className="h-full w-full object-cover object-center" />
                                                    ) : (
                                                        <div className="h-full w-full bg-gray-100"></div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                                                    <div className="text-sm text-gray-500">{item.variant_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-gray-500">${parseFloat(item.price).toFixed(2)}</td>
                                        <td className="py-4 text-sm text-gray-500">{item.quantity}</td>
                                        <td className="py-4 text-right text-sm font-medium text-gray-900">
                                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 flex justify-end border-t pt-4">
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Subtotal: ${parseFloat(order.subtotal || 0).toFixed(2)}</div>
                                <div className="text-sm text-gray-500">Shipping: ${parseFloat(order.shipping_fee || 0).toFixed(2)}</div>
                                <div className="text-xl font-bold text-gray-900 mt-2">Total: ${parseFloat(order.total_amount).toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Customer</h2>
                        <div className="text-sm">
                            <p className="font-medium text-gray-900">{order.user ? order.user.name : 'Guest'}</p>
                            <p className="text-gray-500">{order.email}</p>
                            <p className="text-gray-500">{order.phone}</p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                        <div className="text-sm text-gray-500">
                            <p>{order.shipping_address}</p>
                            <p>{order.city}, {order.state} {order.zip_code}</p>
                            <p>{order.country}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
