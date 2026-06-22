import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {useAuth} from '../../../context/AuthContext';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const {checkAuth} = useAuth();

    useEffect(() => {
        const handleAuth = async () => {
            try {
                await checkAuth();
                toast.success('Welcome to StayHive!', {
                    id: 'login-success'
                });
            } catch (err) {
                toast.error('Failed to authenticate');
            } finally {
                navigate('/');
            }
        };
        handleAuth();
    }, [navigate, checkAuth]);

    return <div className="min-h-screen flex items-center justify-center text-white">Signing you in...</div>;
};

export default OAuth2RedirectHandler;