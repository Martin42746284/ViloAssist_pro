import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDark] = useState(true); // Toujours en mode sombre

  useEffect(() => {
    // Forcer le mode sombre au chargement
    const root = window.document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    
    // Supprimer le localStorage pour éviter les conflits
    if (typeof window !== 'undefined') {
      localStorage.removeItem('theme');
    }
  }, []);

  return { 
    isDark: true, // Toujours vrai
    toggleTheme: () => {} // Fonction vide car plus de toggle nécessaire
  };
};
