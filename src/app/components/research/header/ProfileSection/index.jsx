// components/header/ProfileSection/index.jsx
'use client';

import { useAuth } from '../../../../hooks/useAuth';

import { useEffect, useState, useCallback } from 'react';
import ProfileIcon from './ProfileIcon.client';
import SignInButton from './SignInButton.client';
import UserDropdown from './UserDropdown.client';
import { AuthModal } from '../../../auth/AuthModal';

export default function ProfileSection({authState, setUserData}) {
    // const { user, loading, error, logout } = useAuth();
    const { user, loading, error, logout } = authState;

    const [mounted, setMounted] = useState(false);


    const [modalState, setModalState] = useState({
        isOpen: false,
        view: 'login'  // 'login' or 'register'
      });
    
    const openAuthModal = useCallback((view = 'login') => {
        setModalState({ isOpen: true, view });
      }, []);
    
      const closeAuthModal = useCallback(() => {
        setModalState({ isOpen: false, view: 'login' });
      }, []);
    

    useEffect(() => {
        setMounted(true);
        console.log("ProfileSection mounted");
    }, []);

    useEffect(() => {
        if (mounted) {
            console.log("ProfileSection - auth state updated:", {
                user,
                loading,
                error
            });
        }
    }, [user, loading, error, mounted]);


    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Initial check
        const hasUser = document.documentElement.classList.contains('user');
        if (hasUser) {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setCurrentUser(JSON.parse(savedUser));
                setUserData(savedUser)
            }
        }

    }, []);


    useEffect(() => {
        // Listen for changes
        const handleUserChange = (event) => {
            console.log("User state changed:", event.detail);
            setCurrentUser(event.detail.user);
            setUserData(event.detail.user)
        };

        window.addEventListener('userStateChanged', handleUserChange);
        return () => window.removeEventListener('userStateChanged', handleUserChange);
    }, []);

    // Don't render until client-side hydration is complete
    if (!mounted) return null;

    if (loading) {
        return (
            <div className="animate-pulse flex items-center gap-4">
                <div className="h-8 w-8 bg-tertiary/10 rounded-full" />
            </div>
        );
    }

    return (
        <>
        <div className="flex items-center gap-4">
            {currentUser ? (
                    <UserDropdown 
                        user={currentUser} 
                        onLogout={logout} 
                    />
               
            ) : (
                <SignInButton 
                    onClick={() => openAuthModal('login')} 
                    />    
            )}
        </div>
         <AuthModal 
         isOpen={modalState.isOpen}

         initialView={modalState.view}
         onClose={closeAuthModal}
       />
       </>
    );
}