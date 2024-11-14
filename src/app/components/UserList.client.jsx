// src/app/components/UserList.client.jsx
'use client';

import { useState, useEffect } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ first_name: '', last_name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [createIsLoading, setCreateIsLoading] = useState(false);
  const [formError, setFormError] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!newUser.first_name.trim()) errors.first_name = 'First name is required';
    if (!newUser.last_name.trim()) errors.last_name = 'Last name is required';
    if (!newUser.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(newUser.email)) errors.email = 'Email is invalid';
    return errors;
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/backend/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      console.log({response});
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }
    setCreateIsLoading(true);
    try {
      const response = await fetch('/api/backend/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to create user');
      const data = await response.json();
      setUsers(prevUsers => [createdUser, ...prevUsers]);
      setNewUser({ first_name: '', last_name: '', email: '' });
      setFormError({});
    } catch (err) {
      console.error(err);
    } finally {
      setCreateIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);



  return (
    <div className="w-full max-w-2xl mx-auto p-6 animate-fade-in">
      {/* Form Card */}
      <div className="card bg-background mb-6 shadow-lg p-4">
        <h2 className="text-xl text-primary font-bold mb-4">Create New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* First Name Input */}
            <div className="relative">
              <input
                type="text"
                name="first_name"
                value={newUser.first_name}
                onChange={(e) => {
                  setNewUser({ ...newUser, first_name: e.target.value });
                  setFormError({ ...formError, first_name: '' });
                }}
                className={`input focus-highlight ${
                  formError.first_name ? 'border-error' : ''
                }`}
                placeholder="First Name"
              />
              {formError.first_name && (
                <p className="text-error text-sm mt-1 animate-wiggle-once">
                  {formError.first_name}
                </p>
              )}
            </div>
  
            {/* Last Name Input */}
            <div className="relative">
              <input
                type="text"
                name="last_name"
                value={newUser.last_name}
                onChange={(e) => {
                  setNewUser({ ...newUser, last_name: e.target.value });
                  setFormError({ ...formError, last_name: '' });
                }}
                className={`input focus-highlight ${
                  formError.last_name ? 'border-error' : ''
                }`}
                placeholder="Last Name"
              />
              {formError.last_name && (
                <p className="text-error text-sm mt-1 animate-wiggle-once">
                  {formError.last_name}
                </p>
              )}
            </div>
          </div>
  
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={(e) => {
                setNewUser({ ...newUser, email: e.target.value });
                setFormError({ ...formError, email: '' });
              }}
              className={`input focus-highlight ${
                formError.email ? 'border-error' : ''
              }`}
              placeholder="Email Address"
            />
            {formError.email && (
              <p className="text-error text-sm mt-1 animate-wiggle-once">
                {formError.email}
              </p>
            )}
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            disabled={createIsLoading}
            className={`btn w-full py-2 ${
              createIsLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {createIsLoading ? (
              <span className="animate-pulse">Creating User...</span>
            ) : (
              'Create User'
            )}
          </button>
        </form>
      </div>
  
      {/* Users List */}
      <div className="card bg-background shadow-lg p-4">
        <h2 className="text-xl text-primary font-bold mb-4">User List</h2>
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="p-3 bg-background rounded-lg border border-tertiary hover:border-primary transition-fast animate-slide-in-left"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-1 md:space-y-0">
                  <div>
                    <h3 className="text-md font-semibold text-primary">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-secondary text-sm">{user.email}</p>
                  </div>
                  <span className="text-xs text-tertiary">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-tertiary">
              {isLoading ? (
                <div className="animate-pulse">Loading users...</div>
              ) : (
                <p>No users found. Create one above!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}