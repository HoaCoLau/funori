import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import { Save, ArrowLeft, Plus, Trash2, Upload, X, Search } from 'lucide-react';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    
    // Search & Selection State
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [collectionOptions, setCollectionOptions] = useState([]);
    const [attributeOptions, setAttributeOptions] = useState([]); // New state for attributes
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    
    const [categorySearch, setCategorySearch] = useState('');
    const [collectionSearch, setCollectionSearch] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);

    const categoryDropdownRef = useRef(null);
    const collectionDropdownRef = useRef(null);
    
    const [formData, setFormData] = useState({
        product_name: '',
        base_sku: '',
        description: '',
        base_price: '',
        categories: [],
        collections: [],
        images: [],
        variants: [],
        specifications: []
    });

    // Attribute Selection State
    const [activeAttributes, setActiveAttributes] = useState([]);
    const [attributeSearch, setAttributeSearch] = useState('');
    const [showAttributeDropdown, setShowAttributeDropdown] = useState(false);
    const attributeDropdownRef = useRef(null);
    const attributesInitialized = useRef(false);

    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        fetchDependencies();
        if (isEditMode) {
            fetchProduct();
        }

        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setShowCategoryDropdown(false);
            }
            if (collectionDropdownRef.current && !collectionDropdownRef.current.contains(event.target)) {
                setShowCollectionDropdown(false);
            }
            if (attributeDropdownRef.current && !attributeDropdownRef.current.contains(event.target)) {
                setShowAttributeDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [id]);

    // Initialize active attributes from existing variants
    useEffect(() => {
        if (!attributesInitialized.current && attributeOptions.length > 0 && formData.variants.length > 0) {
            const usedIds = new Set();
            formData.variants.forEach(v => {
                if (v.attribute_values) {
                    Object.keys(v.attribute_values).forEach(k => usedIds.add(parseInt(k)));
                }
            });
            
            if (usedIds.size > 0) {
                const initialActive = attributeOptions.filter(opt => usedIds.has(opt.id));
                setActiveAttributes(initialActive);
            }
            attributesInitialized.current = true;
        }
    }, [attributeOptions, formData.variants]);

    // Search Effects
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCategories(categorySearch);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [categorySearch]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCollections(collectionSearch);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [collectionSearch]);

    const fetchCategories = async (search = '') => {
        try {
            const response = await api.get(`/categories?search=${search}&per_page=20`);
            const data = response.data.data;
            setCategoryOptions(Array.isArray(data) ? data : (data.data || []));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCollections = async (search = '') => {
        try {
            const response = await api.get(`/collections?search=${search}&per_page=20`);
            const data = response.data.data;
            setCollectionOptions(Array.isArray(data) ? data : (data.data || []));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAttributes = async () => {
        try {
            const response = await api.get('/attributes?per_page=100'); // Fetch all attributes
            const data = response.data.data;
            setAttributeOptions(Array.isArray(data) ? data : (data.data || []));
        } catch (error) {
            console.error('Error fetching attributes:', error);
        }
    };

    const fetchDependencies = async () => {
        // Initial load of options
        await Promise.all([fetchCategories(), fetchCollections(), fetchAttributes()]);
    };

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            const product = response.data.data;
            
            setFormData({
                product_name: product.name,
                base_sku: product.sku,
                description: product.description || '',
                base_price: product.base_price,
                categories: product.categories.map(c => c.id),
                collections: product.collections.map(c => c.id),
                images: product.images.map(img => ({
                    ...img,
                    image_id: img.id
                })) || [],
                variants: product.variants.map(v => ({
                    variant_id: v.id,
                    variant_sku: v.sku,
                    price: v.price,
                    stock_quantity: v.stock_quantity,
                    main_image_url: v.main_image_url,
                    attribute_values: v.attributes ? v.attributes.reduce((acc, curr) => {
                        acc[curr.attribute_id] = curr.value_id;
                        return acc;
                    }, {}) : {}
                })) || [],
                specifications: product.specifications.map(s => ({
                    spec_name: s.name,
                    spec_value: s.value
                })) || []
            });

            // Set selected items for display
            setSelectedCategories(product.categories || []);
            setSelectedCollections(product.collections || []);

        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Failed to load product details');
            navigate('/products');
        } finally {
            setInitialLoading(false);
        }
    };

    const addCategory = (category) => {
        if (!selectedCategories.find(c => c.id === category.id)) {
            const newSelected = [...selectedCategories, category];
            setSelectedCategories(newSelected);
            setFormData(prev => ({ ...prev, categories: newSelected.map(c => c.id) }));
        }
        setCategorySearch('');
        setShowCategoryDropdown(false);
    };

    const removeCategory = (id) => {
        const newSelected = selectedCategories.filter(c => c.id !== id);
        setSelectedCategories(newSelected);
        setFormData(prev => ({ ...prev, categories: newSelected.map(c => c.id) }));
    };

    const addCollection = (collection) => {
        if (!selectedCollections.find(c => c.id === collection.id)) {
            const newSelected = [...selectedCollections, collection];
            setSelectedCollections(newSelected);
            setFormData(prev => ({ ...prev, collections: newSelected.map(c => c.id) }));
        }
        setCollectionSearch('');
        setShowCollectionDropdown(false);
    };

    const removeCollection = (id) => {
        const newSelected = selectedCollections.filter(c => c.id !== id);
        setSelectedCollections(newSelected);
        setFormData(prev => ({ ...prev, collections: newSelected.map(c => c.id) }));
    };

    const addAttribute = (attribute) => {
        if (!activeAttributes.find(a => a.id === attribute.id)) {
            setActiveAttributes([...activeAttributes, attribute]);
        }
        setAttributeSearch('');
        setShowAttributeDropdown(false);
    };

    const removeAttribute = (id) => {
        setActiveAttributes(activeAttributes.filter(a => a.id !== id));
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => {
                if (v.attribute_values && v.attribute_values[id]) {
                    const newAttrValues = { ...v.attribute_values };
                    delete newAttrValues[id];
                    return { ...v, attribute_values: newAttrValues };
                }
                return v;
            })
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Image Handling
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            image_url: file, // File object for upload
            preview: URL.createObjectURL(file),
            alt_text: '',
            sort_order: 0,
            is_new: true
        }));
        
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Variant Handling
    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, {
                variant_sku: '',
                price: '',
                stock_quantity: 0,
                main_image_url: null, // File or String
                preview_url: null,
                attribute_values: {} // { attribute_id: value_id }
            }]
        }));
    };

    const updateVariant = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index][field] = value;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const updateVariantAttribute = (variantIndex, attributeId, valueId) => {
        const newVariants = [...formData.variants];
        if (!newVariants[variantIndex].attribute_values) {
            newVariants[variantIndex].attribute_values = {};
        }
        newVariants[variantIndex].attribute_values[attributeId] = valueId;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleVariantImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newVariants = [...formData.variants];
            newVariants[index].main_image_url = file;
            newVariants[index].preview_url = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, variants: newVariants }));
        }
    };

    const removeVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    // Specification Handling
    const addSpec = () => {
        setFormData(prev => ({
            ...prev,
            specifications: [...prev.specifications, { spec_name: '', spec_value: '' }]
        }));
    };

    const updateSpec = (index, field, value) => {
        const newSpecs = [...formData.specifications];
        newSpecs[index][field] = value;
        setFormData(prev => ({ ...prev, specifications: newSpecs }));
    };

    const removeSpec = (index) => {
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Need to use FormData for file uploads
            const data = new FormData();
            data.append('product_name', formData.product_name);
            data.append('base_sku', formData.base_sku);
            data.append('description', formData.description);
            data.append('base_price', formData.base_price);

            // Arrays need special handling for FormData
            formData.categories.forEach((id, index) => data.append(`categories[${index}]`, id));
            formData.collections.forEach((id, index) => data.append(`collections[${index}]`, id));

            // Images
            formData.images.forEach((img, index) => {
                if (img.image_id) {
                    data.append(`images[${index}][image_id]`, img.image_id);
                    data.append(`images[${index}][alt_text]`, img.alt_text || '');
                    data.append(`images[${index}][sort_order]`, img.sort_order || 0);
                    // Important: Send existing URL string to satisfy 'required' validation in controller
                    data.append(`images[${index}][image_url]`, img.image_url);
                } else if (img.image_url instanceof File) {
                    data.append(`images[${index}][image_url]`, img.image_url);
                    data.append(`images[${index}][alt_text]`, img.alt_text || '');
                    data.append(`images[${index}][sort_order]`, img.sort_order || 0);
                }
            });

            // Variants
            formData.variants.forEach((variant, index) => {
                if (variant.variant_id) data.append(`variants[${index}][variant_id]`, variant.variant_id);
                data.append(`variants[${index}][variant_sku]`, variant.variant_sku);
                data.append(`variants[${index}][price]`, variant.price);
                data.append(`variants[${index}][stock_quantity]`, variant.stock_quantity);
                
                if (variant.main_image_url instanceof File) {
                    data.append(`variants[${index}][main_image_url]`, variant.main_image_url);
                } else if (typeof variant.main_image_url === 'string') {
                     // If it's an existing string URL, we might not need to send it if controller treats nullable, 
                     // but sending it doesn't hurt if controller handles it.
                     // However, for file uploads, usually we only send if it's a new file.
                }

                // Attributes
                if (variant.attribute_values) {
                    Object.values(variant.attribute_values).forEach((valId, vIndex) => {
                        if (valId) {
                            data.append(`variants[${index}][attribute_values][${vIndex}]`, valId);
                        }
                    });
                }
            });

            // Specifications
            formData.specifications.forEach((spec, index) => {
                data.append(`specifications[${index}][spec_name]`, spec.spec_name);
                data.append(`specifications[${index}][spec_value]`, spec.spec_value);
            });

            if (isEditMode) {
                data.append('_method', 'PUT'); // Laravel requires this for PUT with FormData
                await api.post(`/products/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            navigate('/products');
        } catch (error) {
            console.error('Error saving product:', error);
            alert(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div>Loading product details...</div>;

    return (
        <div className="pb-10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate('/products')} className="mr-4 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-indigo-700 disabled:opacity-50"
                >
                    <Save size={20} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Product'}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        {['general', 'images', 'variants', 'specifications'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-6 text-center border-b-2 font-medium text-sm capitalize ${
                                    activeTab === tab
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* General Tab */}
                    <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    name="product_name"
                                    value={formData.product_name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Base SKU</label>
                                <input
                                    type="text"
                                    name="base_sku"
                                    value={formData.base_sku}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
                                <input
                                    type="number"
                                    name="base_price"
                                    value={formData.base_price}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                ></textarea>
                            </div>

                            <div className="relative" ref={categoryDropdownRef}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        value={categorySearch}
                                        onChange={(e) => {
                                            setCategorySearch(e.target.value);
                                            setShowCategoryDropdown(true);
                                        }}
                                        onFocus={() => setShowCategoryDropdown(true)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                    />
                                    <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                                </div>
                                
                                {showCategoryDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {categoryOptions.length > 0 ? (
                                            categoryOptions.map(cat => (
                                                <div
                                                    key={cat.id}
                                                    onClick={() => addCategory(cat)}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                >
                                                    {cat.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500 text-sm">No categories found</div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedCategories.map(cat => (
                                        <span key={cat.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {cat.name}
                                            <button
                                                type="button"
                                                onClick={() => removeCategory(cat.id)}
                                                className="ml-1.5 inline-flex items-center justify-center text-indigo-400 hover:text-indigo-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="relative" ref={collectionDropdownRef}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Collections</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search collections..."
                                        value={collectionSearch}
                                        onChange={(e) => {
                                            setCollectionSearch(e.target.value);
                                            setShowCollectionDropdown(true);
                                        }}
                                        onFocus={() => setShowCollectionDropdown(true)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                    />
                                    <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                                </div>
                                
                                {showCollectionDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {collectionOptions.length > 0 ? (
                                            collectionOptions.map(col => (
                                                <div
                                                    key={col.id}
                                                    onClick={() => addCollection(col)}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                >
                                                    {col.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500 text-sm">No collections found</div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedCollections.map(col => (
                                        <span key={col.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {col.name}
                                            <button
                                                type="button"
                                                onClick={() => removeCollection(col.id)}
                                                className="ml-1.5 inline-flex items-center justify-center text-green-400 hover:text-green-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="flex items-center space-x-2">
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Images Tab */}
                    <div className={activeTab === 'images' ? 'block' : 'hidden'}>
                        <div className="mb-4">
                            <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 cursor-pointer transition-colors">
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm font-medium text-gray-900">Click to upload images</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative group border rounded-lg p-2">
                                    <img 
                                        src={img.preview || img.image_url} 
                                        alt="Preview" 
                                        className="w-full h-32 object-cover rounded"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={16} />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Alt Text"
                                        value={img.alt_text || ''}
                                        onChange={(e) => {
                                            const newImages = [...formData.images];
                                            newImages[index].alt_text = e.target.value;
                                            setFormData(prev => ({ ...prev, images: newImages }));
                                        }}
                                        className="mt-2 w-full text-xs border rounded px-2 py-1"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Variants Tab */}
                    <div className={activeTab === 'variants' ? 'block' : 'hidden'}>
                        {/* Attribute Selection */}
                        <div className="mb-6 p-4 bg-white border rounded-lg shadow-sm">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Product Attributes</h3>
                            <div className="relative" ref={attributeDropdownRef}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search attributes to add (e.g. Color, Size)..."
                                        value={attributeSearch}
                                        onChange={(e) => {
                                            setAttributeSearch(e.target.value);
                                            setShowAttributeDropdown(true);
                                        }}
                                        onFocus={() => setShowAttributeDropdown(true)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                                    />
                                    <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                                </div>
                                
                                {showAttributeDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {attributeOptions.filter(a => a.name.toLowerCase().includes(attributeSearch.toLowerCase())).length > 0 ? (
                                            attributeOptions
                                                .filter(a => a.name.toLowerCase().includes(attributeSearch.toLowerCase()))
                                                .map(attr => (
                                                <div
                                                    key={attr.id}
                                                    onClick={() => addAttribute(attr)}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                >
                                                    {attr.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500 text-sm">No attributes found</div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {activeAttributes.map(attr => (
                                        <span key={attr.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {attr.name}
                                            <button
                                                type="button"
                                                onClick={() => removeAttribute(attr.id)}
                                                className="ml-2 inline-flex items-center justify-center text-blue-400 hover:text-blue-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                    {activeAttributes.length === 0 && (
                                        <span className="text-sm text-gray-500 italic">No attributes selected. Add attributes to configure variants.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={addVariant}
                            className="mb-4 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg flex items-center hover:bg-indigo-200"
                        >
                            <Plus size={18} className="mr-2" /> Add Variant
                        </button>

                        <div className="space-y-4">
                            {formData.variants.map((variant, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50 relative">
                                    <button 
                                        onClick={() => removeVariant(index)}
                                        className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-8 items-start">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">SKU</label>
                                            <input
                                                type="text"
                                                value={variant.variant_sku}
                                                onChange={(e) => updateVariant(index, 'variant_sku', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                                            <input
                                                type="number"
                                                value={variant.price}
                                                onChange={(e) => updateVariant(index, 'price', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
                                            <input
                                                type="number"
                                                value={variant.stock_quantity}
                                                onChange={(e) => updateVariant(index, 'stock_quantity', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                            />
                                        </div>
                                        
                                        {/* Dynamic Attributes */}
                                        {activeAttributes.map(attr => (
                                            <div key={attr.id}>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">{attr.name}</label>
                                                <select
                                                    value={variant.attribute_values?.[attr.id] || ''}
                                                    onChange={(e) => updateVariantAttribute(index, attr.id, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                >
                                                    <option value="">Select {attr.name}</option>
                                                    {attr.values?.map(val => (
                                                        <option key={val.id} value={val.id}>{val.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ))}

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Image</label>
                                            <div className="flex items-center space-x-2">
                                                <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden border">
                                                    {(variant.preview_url || variant.main_image_url) ? (
                                                        <img 
                                                            src={variant.preview_url || variant.main_image_url} 
                                                            alt="Variant" 
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="flex items-center justify-center h-full text-xs text-gray-400">No Img</span>
                                                    )}
                                                </div>
                                                <label className="cursor-pointer bg-white border border-gray-300 rounded px-2 py-1 text-xs hover:bg-gray-50">
                                                    Upload
                                                    <input 
                                                        type="file" 
                                                        className="hidden" 
                                                        accept="image/*"
                                                        onChange={(e) => handleVariantImageUpload(index, e)}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Specifications Tab */}
                    <div className={activeTab === 'specifications' ? 'block' : 'hidden'}>
                        <button 
                            onClick={addSpec}
                            className="mb-4 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg flex items-center hover:bg-indigo-200"
                        >
                            <Plus size={18} className="mr-2" /> Add Specification
                        </button>

                        <div className="space-y-2">
                            {formData.specifications.map((spec, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Name (e.g., Color)"
                                        value={spec.spec_name}
                                        onChange={(e) => updateSpec(index, 'spec_name', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value (e.g., Red)"
                                        value={spec.spec_value}
                                        onChange={(e) => updateSpec(index, 'spec_value', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    />
                                    <button 
                                        onClick={() => removeSpec(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
