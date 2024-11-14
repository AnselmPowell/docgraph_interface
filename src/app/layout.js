// src/app/layout.js
'use client';

import { Suspense } from 'react';
import './styles/globals.css';
import Navbar from './components/main/Navbar.client';
import Footer from './components/main/Footer.client';
import { AuthProvider } from './contexts/AuthContext.client';
import { AppProvider } from './contexts/AppContext.client';
import ThemeScript from './contexts/ThemeScript';


export default function RootLayout({ children }) {
  
  return (
    // data-theme={window.__theme || 'light'}  
    <html lang="en" suppressHydrationWarning >
      <head>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning>
        <AppProvider>
            <AuthProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
                {children}
                <Footer/>
              </Suspense>
            </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}