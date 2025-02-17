// contexts/AuthContext.client.jsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [mounted, setMounted] = useState(false);
    
    // Get auth functionality from hook
    const auth = useAuthHook();
    
    // Only render after initial mount
    useEffect(() => {
        setMounted(true);
        console.log("AuthProvider mounted");
    }, []);

    // Debug logs for auth state changes
    useEffect(() => {
        console.log("AuthProvider - auth state changed:", {
            user: auth.user,
            loading: auth.loading
        });
    }, [auth.user, auth.loading]);

    // Don't render anything until after client-side hydration
    if (!mounted) {
        return null;
    }

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};