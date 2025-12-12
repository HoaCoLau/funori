import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Admin/Context/AuthContext';
import ProtectedRoute from './Admin/Components/ProtectedRoute';
import AdminLayout from './Admin/Layouts/AdminLayout';
import Dashboard from './Admin/Pages/Dashboard';
import Login from './Admin/Pages/Login';
import CategoryList from './Admin/Pages/Categories/CategoryList';
import CategoryForm from './Admin/Pages/Categories/CategoryForm';
import CollectionList from './Admin/Pages/Collections/CollectionList';
import CollectionForm from './Admin/Pages/Collections/CollectionForm';
import StyleList from './Admin/Pages/Styles/StyleList';
import StyleForm from './Admin/Pages/Styles/StyleForm';
import ProductList from './Admin/Pages/Products/ProductList';
import ProductForm from './Admin/Pages/Products/ProductForm';
import ProductDetail from './Admin/Pages/Products/ProductDetail';
import AttributeList from './Admin/Pages/Attributes/AttributeList';
import AttributeForm from './Admin/Pages/Attributes/AttributeForm';
import OrderList from './Admin/Pages/Orders/OrderList';
import OrderDetail from './Admin/Pages/Orders/OrderDetail';
import UserList from './Admin/Pages/Users/UserList';
import UserForm from './Admin/Pages/Users/UserForm';
import CouponList from './Admin/Pages/Coupons/CouponList';
import CouponForm from './Admin/Pages/Coupons/CouponForm';
import ReviewList from './Admin/Pages/Reviews/ReviewList';
import BannerList from './Admin/Pages/Banners/BannerList';
import BannerForm from './Admin/Pages/Banners/BannerForm';
import PostList from './Admin/Pages/Posts/PostList';
import PostForm from './Admin/Pages/Posts/PostForm';
import PostCategoryList from './Admin/Pages/PostCategories/PostCategoryList';
import PostCategoryForm from './Admin/Pages/PostCategories/PostCategoryForm';
import ContactSubmissionList from './Admin/Pages/ContactSubmissions/ContactSubmissionList';
import ContactSubmissionDetail from './Admin/Pages/ContactSubmissions/ContactSubmissionDetail';
import ShippingMethodList from './Admin/Pages/ShippingMethods/ShippingMethodList';
import ShippingMethodForm from './Admin/Pages/ShippingMethods/ShippingMethodForm';
import PaymentMethodList from './Admin/Pages/PaymentMethods/PaymentMethodList';
import PaymentMethodForm from './Admin/Pages/PaymentMethods/PaymentMethodForm';

if (document.getElementById('admin-root')) {
    const root = ReactDOM.createRoot(document.getElementById('admin-root'));
    root.render(
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                        <Route path="/login" element={<Login />} />
                        
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<AdminLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="categories" element={<CategoryList />} />
                                <Route path="categories/create" element={<CategoryForm />} />
                                <Route path="categories/edit/:id" element={<CategoryForm />} />
                                
                                <Route path="collections" element={<CollectionList />} />
                                <Route path="collections/create" element={<CollectionForm />} />
                                <Route path="collections/edit/:id" element={<CollectionForm />} />

                                <Route path="styles" element={<StyleList />} />
                                <Route path="styles/create" element={<StyleForm />} />
                                <Route path="styles/edit/:id" element={<StyleForm />} />

                                <Route path="products" element={<ProductList />} />
                                <Route path="products/create" element={<ProductForm />} />
                                <Route path="products/:id" element={<ProductDetail />} />
                                <Route path="products/edit/:id" element={<ProductForm />} />

                                <Route path="attributes" element={<AttributeList />} />
                                <Route path="attributes/create" element={<AttributeForm />} />
                                <Route path="attributes/:id/edit" element={<AttributeForm />} />

                                <Route path="orders" element={<OrderList />} />
                                <Route path="orders/:id" element={<OrderDetail />} />

                                <Route path="users" element={<UserList />} />
                                <Route path="users/create" element={<UserForm />} />
                                <Route path="users/edit/:id" element={<UserForm />} />

                                <Route path="coupons" element={<CouponList />} />
                                <Route path="coupons/create" element={<CouponForm />} />
                                <Route path="coupons/edit/:id" element={<CouponForm />} />

                                <Route path="reviews" element={<ReviewList />} />
                                
                                <Route path="banners" element={<BannerList />} />
                                <Route path="banners/create" element={<BannerForm />} />
                                <Route path="banners/edit/:id" element={<BannerForm />} />

                                <Route path="posts" element={<PostList />} />
                                <Route path="posts/create" element={<PostForm />} />
                                <Route path="posts/edit/:id" element={<PostForm />} />

                                <Route path="post-categories" element={<PostCategoryList />} />
                                <Route path="post-categories/create" element={<PostCategoryForm />} />
                                <Route path="post-categories/edit/:id" element={<PostCategoryForm />} />

                                <Route path="contact-submissions" element={<ContactSubmissionList />} />
                                <Route path="contact-submissions/:id" element={<ContactSubmissionDetail />} />

                                <Route path="shipping-methods" element={<ShippingMethodList />} />
                                <Route path="shipping-methods/create" element={<ShippingMethodForm />} />
                                <Route path="shipping-methods/edit/:id" element={<ShippingMethodForm />} />

                                <Route path="payment-methods" element={<PaymentMethodList />} />
                                <Route path="payment-methods/create" element={<PaymentMethodForm />} />
                                <Route path="payment-methods/edit/:id" element={<PaymentMethodForm />} />

                                {/* Add more admin routes here */}
                                <Route path="*" element={<div className="p-4">Page not found</div>} />
                            </Route>
                        </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
