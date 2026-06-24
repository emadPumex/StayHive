import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {useAuth} from '../../../context/AuthContext';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const {checkAuth} = useAuth();

    useEffect(() => {
        // Capture & clear the redirect destination synchronously before any async work,
        // so it cannot be lost due to re-renders or timing races.
        const redirectTo = localStorage.getItem('auth_redirect') || '/';
        localStorage.removeItem('auth_redirect');

        const handleAuth = async () => {
            try {
                await checkAuth();
                toast.success('Welcome to StayHive!', {
                    id: 'login-success'
                });
            } catch (err) {
                toast.error('Failed to authenticate');
            } finally {
                navigate(redirectTo, {replace: true});
            }
        };
        handleAuth();
    }, [navigate, checkAuth]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#0A0C12]">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C8FB4C] border-t-transparent"/>
            <span className="text-sm font-semibold text-[#8A8FA8]">Signing you in...</span>
        </div>
    );
};

export default OAuth2RedirectHandler;

