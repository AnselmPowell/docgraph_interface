import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

export const WelcomeMessage = ({ documents = [], stagedDocuments = [], pendingDocuments = [], userData = null }) => {
  const [showMessage, setShowMessage] = useState(false);
  const hasDocuments = documents.length > 0 || stagedDocuments.length > 0 || pendingDocuments.length > 0;
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  
  // Detect when user logs in
  useEffect(() => {
    if (userData) {
      setUserLoggedIn(true);
    }
  }, [userData]);
  
  // Fade in message after 5 seconds of user login
  useEffect(() => {
    let timer;
    if (userLoggedIn) {
      timer = setTimeout(() => {
        setShowMessage(true);
      }, 6500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [userLoggedIn]);

  return (
    <AnimatePresence>
      {showMessage && (
        <div className="absolute -top-20 left-20 inset-0 flex items-center justify-center opacity-50 pointer-events-none z-0">
          <div className="max-w-xl text-center space-y-12">
            {/* Part 1: What is DocGraph - Always visible */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-primary mb-3">Welcome to DocGraph</h2>
              <p className="text-lg text-tertiary">
                Your AI-powered research assistant that analyses academic papers, 
                finds relevant information, and helps you build properly cited arguments.
              </p>
            </motion.div>

            {/* Part 2: Get Started - Only visible when no documents */}
            <AnimatePresence>
              {!hasDocuments && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative right-5 flex items-center mb-2">
                    <motion.div
                      animate={{ x: [-5, 5, -5] }}
                      transition={{ repeat: 3, duration: 1.5 }}
                      className="mr-3"
                    >
                      <ChevronLeft className="w-8 h-8 text-primary" />
                    </motion.div>
                    <p className="text-xl font-medium text-tertiary">
                      Upload your PDF files to get started
                    </p>
                  </div>
                  <p className="text-sm text-tertiary/70">
                    Drag & drop files or use the upload button in the sidebar
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeMessage;