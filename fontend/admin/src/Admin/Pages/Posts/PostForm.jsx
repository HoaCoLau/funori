import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../Services/api';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import JoditEditor from 'jodit-react';

const PostForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        post_category_id: '',
        status: 'draft',
        featured_image: null
    });
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const editor = useRef(null);
    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Start typing...',
        uploader: {
            insertImageAsBase64URI: true
        },
        height: 600,
        toolbarAdaptive: false,
        buttons: [
            'source', '|',
            'bold', 'strikethrough', 'underline', 'italic', '|',
            'ul', 'ol', '|',
            'outdent', 'indent',  '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'video', 'table', 'link', '|',
            'align', 'undo', 'redo', '|',
            'hr', 'eraser', 'copyformat', '|',
            'fullsize', 'selectall', 'print', 'about'
        ]
    }), []);

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchPost();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/post-categories');
            let items = [];
            if (response.data?.data && Array.isArray(response.data.data)) {
                items = response.data.data;
            } else if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                 items = response.data.data.data;
            } else if (Array.isArray(response.data)) {
                items = response.data;
            }
            setCategories(items);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPost = async () => {
        try {
            const response = await api.get(`/posts/${id}`);
            const post = response.data?.data || response.data;
            
            if (!post) throw new Error('Post data not found');

            setFormData({
                title: post.title || '',
                content: post.content || '',
                post_category_id: post.post_category_id || post.category_id || '',
                status: post.status || 'draft',
                featured_image: null // Don't set file object here
            });
            if (post.featured_image) {
                setImagePreview(post.featured_image);
            } else if (post.image_url) {
                setImagePreview(post.image_url);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            setError('Failed to load post data');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'is_published') {
             setFormData(prev => ({
                ...prev,
                status: checked ? 'published' : 'draft'
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleContentChange = (content) => {
        setFormData(prev => ({
            ...prev,
            content: content
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({ ...prev, featured_image: file }));
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('content', formData.content);
            if (formData.post_category_id) {
                data.append('post_category_id', formData.post_category_id);
            }
            data.append('status', formData.status);
            
            if (formData.featured_image instanceof File) {
                data.append('featured_image', formData.featured_image);
            }

            if (isEditMode) {
                // For PUT requests with FormData, Laravel/PHP sometimes needs _method=PUT
                data.append('_method', 'PUT');
                await api.post(`/posts/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/posts', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/posts');
        } catch (error) {
            console.error('Error saving post:', error);
            setError(error.response?.data?.message || 'Failed to save post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate('/posts')}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Edit Post' : 'Create Post'}
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 w-full">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-4">
                            <div>
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <JoditEditor
                                    ref={editor}
                                    value={formData.content}
                                    config={config}
                                    tabIndex={1}
                                    onBlur={newContent => handleContentChange(newContent)}
                                    onChange={() => {}}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="post_category_id"
                                    value={formData.post_category_id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.post_category_id || cat.id} value={cat.post_category_id || cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                                <div className="border border-gray-300 rounded-lg p-4 text-center">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded mb-2" />
                                    ) : (
                                        <div className="h-40 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 inline-block">
                                        <Upload size={16} className="inline mr-2" />
                                        Upload
                                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_published"
                                        checked={formData.status === 'published'}
                                        onChange={handleChange}
                                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Published</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/posts')}
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
                            {loading ? 'Saving...' : 'Save Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostForm;
