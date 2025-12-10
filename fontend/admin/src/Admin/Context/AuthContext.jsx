import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../Services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('admin_token');
            if (token) {
                try {
                    const response = await api.get('/profile');
                    setUser(response.data);
                } catch (error) {
                    console.error('Auth check failed', error);
                    localStorage.removeItem('admin_token');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            // First get CSRF cookie if using Sanctum SPA auth, but here we use token based for API
            // await api.get('/sanctum/csrf-cookie'); 
            
            const response = await api.post('/login', { email, password });
            
            // Correctly access the nested data structure from Laravel response
            // Response structure: { success: true, message: "...", data: { user: {...}, access_token: "..." } }
            const { access_token, user } = response.data.data;
            
            if (!access_token) {
                throw new Error('No access token received');
            }
            
            localStorage.setItem('admin_token', access_token);
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            const message = error.response?.data?.errors?.email?.[0] || 
                          error.response?.data?.message || 
                          'Login failed';
            return { 
                success: false, 
                message: message
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('admin_token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
