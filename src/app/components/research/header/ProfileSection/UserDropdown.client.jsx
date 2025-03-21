// src/app/components/header/ProfileSection/UserDropdown.client.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Settings, Moon, LogOut } from 'lucide-react';
import ProfileIcon from './ProfileIcon.client';

export default function UserDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      label: 'Profile',
      icon: User,
      onClick: () => console.log('Profile clicked')
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => console.log('Settings clicked')
    },
    {
      label: 'Dark Mode',
      icon: Moon,
      onClick: () => console.log('Dark mode clicked'),
      isToggle: true
    }
  ];

  return (
    <div className="relative " ref={dropdownRef}>
      <ProfileIcon user={user} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <>
          {/* Backdrop - Full screen but transparent */}
          <div 
            className="fixed inset-0 bg-transparent z-[998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className=" fixed right-3 mt-2 w-[280px] rounded-xl bg-white 
                         shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-[#E5E5E5] 
                         z-[999] transform origin-top-right animate-in fade-in zoom-in 
                         duration-200 py-2 overflow-hidden">
            
            {/* User Info Section */}
            <div className="px-4 py-3 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <div className="flex-1 pl-2 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">
                    Welcome {user?.first_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick();
                      if (!item.isToggle) setIsOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-[15px] text-[#1A1A1A]
                             hover:bg-[#F7F7F8] flex items-center gap-3
                             transition-colors"
                  >
                    <Icon className="w-5 h-5 text-[#666666]" />
                    {item.label}
                    <span>{`(beta)`}</span>
                  </button>
                );
              })}
            </div>

            {/* Separator */}
            <div className="my-1 border-t my-2 border-[#E5E5E5]" />

            {/* Logout Button */}
            <div className="px-3 pb-2 rounded-lg">
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-[15px] font-medium
                         bg-[#eeeeee] text-[#1A1A1A] rounded-lg
                         hover:bg-[#d8d7d7] transition-colors"
              >
                Sign out
              </button>
            </div>

            {/* Footer Links */}
            <div className="px-4 py-2 flex items-center justify-center gap-4 
                           text-xs text-[#666666]">
              <button className="hover:text-[#1A1A1A] transition-colors">
                Privacy
              </button>
              <button className="hover:text-[#1A1A1A] transition-colors">
                Terms
              </button>
              <button className="hover:text-[#1A1A1A] transition-colors">
                FAQ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}