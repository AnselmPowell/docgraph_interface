// // src/app/contexts/ModalContext.client.jsx
// 'use client';

// import { createContext, useContext, useState, useCallback } from 'react';
// import { AuthModal } from '../components/auth/AuthModal';

// const ModalContext = createContext(null);



// export function ModalProvider({ children }) {
//   const [modalState, setModalState] = useState({
//     isOpen: false,
//     view: 'login'  // 'login' or 'register'
//   });

//   const openAuthModal = useCallback((view = 'login') => {
//     setModalState({ isOpen: true, view });
//   }, []);

//   const closeAuthModal = useCallback(() => {
//     setModalState({ isOpen: false, view: 'login' });
//   }, []);



  

//   return (
//     <ModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
//       {children}
//       <AuthModal 
//         isOpen={modalState.isOpen}
//         fetchDocs={fetchDocs}
//         initialView={modalState.view}
//         onClose={closeAuthModal}
//       />
//     </ModalContext.Provider>
//   );
// }

// export const useModal = () => {
//   const context = useContext(ModalContext);
//   if (!context) {
//     throw new Error('useModal must be used within a ModalProvider');
//   }
//   return context;
// };