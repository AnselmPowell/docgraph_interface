// src/app/components/ui/Button.client.jsx
'use client';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  ...props 
}) {
  const baseStyles = "btn focus-highlight transition-fast";
  
  const variants = {
    primary: "bg-primary text-background hover:brightness-120",
    secondary: "bg-secondary text-background hover:brightness-120",
    outline: "border border-primary text-primary hover:bg-primary/10",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}