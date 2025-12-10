import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../Services/api';
import { ArrowLeft, Edit, Package, Tag, Layers, Palette, Info } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!product) return <div className="p-6">Product not found</div>;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/products" className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold">Product Details</h1>
                </div>
                <Link
                    to={`/products/${id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Edit size={20} />
                    <span>Edit Product</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Info size={20} />
                            Basic Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500">Product Name</label>
                                <p className="text-lg font-medium">{product.name}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Description</label>
                                <div className="prose max-w-none mt-1" dangerouslySetInnerHTML={{ __html: product.description }} />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Images</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {product.images && product.images.map((image, index) => (
                                <div key={index} className="aspect-square rounded-lg overflow-hidden border">
                                    <img 
                                        src={image.url} 
                                        alt={`Product ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Classification</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Tag className="text-gray-400" size={20} />
                                <div>
                                    <label className="text-sm text-gray-500">Category</label>
                                    <p className="font-medium">{product.category?.category_name || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Layers className="text-gray-400" size={20} />
                                <div>
                                    <label className="text-sm text-gray-500">Collection</label>
                                    <p className="font-medium">{product.collection?.name || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Palette className="text-gray-400" size={20} />
                                <div>
                                    <label className="text-sm text-gray-500">Style</label>
                                    <p className="font-medium">{product.style?.name || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Pricing & Inventory</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-500">Base Price</label>
                                <p className="text-xl font-bold text-indigo-600">
                                    ${parseFloat(product.base_price).toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">SKU</label>
                                <p className="font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                                    {product.sku}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">Stock Status</label>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'} ({product.stock_quantity})
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
