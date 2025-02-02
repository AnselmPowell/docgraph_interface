// src/app/layout.js
'use client';

import { Suspense } from 'react';
import './styles/globals.css';
import './styles/svg-animation.css';
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
                {children}
              </Suspense>
            </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}