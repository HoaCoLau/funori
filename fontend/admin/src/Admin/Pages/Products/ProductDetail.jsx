import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../Services/api';
import { ArrowLeft, Edit, Package, Tag, Layers, Palette, Info } from 'lucide-react';
import Skeleton from '../../Components/Skeleton';

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

    if (loading) return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <Skeleton className="h-6 w-40 mb-4" />
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-4 w-24 mt-4" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
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
                    to={`/products/edit/${id}`}
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
                                        src={image.image_url} 
                                        alt={`Product ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Variants Detail */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Package size={20} />
                            Variants
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {product.variants && product.variants.length > 0 ? (
                                        product.variants.map((variant, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {variant.attributes && variant.attributes.length > 0 
                                                        ? variant.attributes.map(av => av.value_name).join(' / ')
                                                        : `Variant ${index + 1}`}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {variant.sku}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${parseFloat(variant.price).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        variant.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {variant.stock_quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {variant.main_image_url ? (
                                                        <img src={variant.main_image_url} alt="" className="h-10 w-10 object-cover rounded border" />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No img</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No variants configured
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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
                                    <label className="text-sm text-gray-500">Categories</label>
                                    <p className="font-medium">
                                        {product.categories && product.categories.length > 0 
                                            ? product.categories.map(c => c.name).join(', ') 
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Layers className="text-gray-400" size={20} />
                                <div>
                                    <label className="text-sm text-gray-500">Collections</label>
                                    <p className="font-medium">
                                        {product.collections && product.collections.length > 0 
                                            ? product.collections.map(c => c.name).join(', ') 
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Palette className="text-gray-400" size={20} />
                                <div>
                                    <label className="text-sm text-gray-500">Specifications</label>
                                    <div className="font-medium text-sm">
                                        {product.specifications && product.specifications.length > 0 ? (
                                            <ul className="list-disc list-inside">
                                                {product.specifications.map((spec, idx) => (
                                                    <li key={idx}>{spec.name}: {spec.value}</li>
                                                ))}
                                            </ul>
                                        ) : 'N/A'}
                                    </div>
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
                                    ${parseFloat(product.base_price).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500">SKU</label>
                                <p className="font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                                    {product.sku}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
