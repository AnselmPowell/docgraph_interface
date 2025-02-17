// src/app/components/auth/FormInput.jsx
export function FormInput({
  icon: Icon,
  type = 'text',
  error,
  disabled,
  className = '',
  ...props
}) {
  return (
      <div className="space-y-1">
          <div className="relative group">
              {/* Icon */}
              {Icon && (
                  <div className={`
                      absolute left-3 top-1/2 -translate-y-1/2 
                      transition-colors duration-200
                      ${error 
                          ? 'text-red-500' 
                          : disabled
                              ? 'text-tertiary/50'
                              : 'text-tertiary group-focus-within:text-primary'
                      }
                  `}>
                      <Icon className="w-5 h-5" />
                  </div>
              )}

              {/* Input */}
              <input
                  type={type}
                  disabled={disabled}
                  className={`
                      w-full rounded-lg px-4 py-2.5
                      ${Icon ? 'pl-10' : ''}
                      bg-background
                      border transition-all duration-200
                      disabled:opacity-60 disabled:cursor-not-allowed
                      ${error 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-tertiary/20 focus:border-primary focus:ring-primary/20'
                      }
                      focus:outline-none focus:ring-2
                      ${disabled ? 'bg-tertiary/5' : 'hover:border-tertiary/30'}
                      ${className}
                  `}
                  {...props}
              />

              {/* Password Toggle Button (if type is password) */}
              {type === 'password' && (
                  <button
                      type="button"
                      className={`
                          absolute right-3 top-1/2 -translate-y-1/2
                          p-1 rounded-md
                          text-tertiary hover:text-primary
                          transition-colors duration-200
                          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onClick={() => {
                          const input = document.querySelector(`input[name="${props.name}"]`);
                          if (input) {
                              input.type = input.type === 'password' ? 'text' : 'password';
                          }
                      }}
                      disabled={disabled}
                  >
                      {type === 'password' ? (
                          <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                          </svg>
                      ) : (
                          <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                          </svg>
                      )}
                  </button>
              )}
          </div>

          {/* Error Message */}
          {error && (
              <p className="text-sm text-red-500 pl-1 animate-in fade-in slide-in-from-top duration-200">
                  {error}
              </p>
          )}
      </div>
  );
}