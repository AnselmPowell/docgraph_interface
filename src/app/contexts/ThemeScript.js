// src/app/contexts/ThemeScript.js
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function getInitialTheme() {
              try {
                const storedTheme = localStorage.getItem('theme');
                // Remove the JSON.parse and handle the string directly
                if (storedTheme) {
                  // Remove any quotes that might be present
                  return storedTheme.replace(/['"]+/g, '');
                }
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  return 'dark';
                }
              } catch {
                return 'light';
              }
              return 'light';
            }
            
            const theme = getInitialTheme();
            
            // Set theme immediately to prevent flash
            document.documentElement.dataset.theme = theme;
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);

            // Make theme available globally before React hydrates
            window.__theme = theme;
          })();
        `,
      }}
    />
  );
}