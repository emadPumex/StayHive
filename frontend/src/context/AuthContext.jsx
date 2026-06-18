import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../core/api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await apiClient.get('/auth/me');
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { checkAuth(); }, []);

    const logout = async () => {
        await apiClient.post('/auth/logout' );
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);