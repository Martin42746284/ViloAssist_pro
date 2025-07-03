import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'user' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;

  updateUser: (updates: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserFromToken = async (token: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Session invalide');
      const data = await res.json();
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
    } catch (error) {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserFromToken(token).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);


  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('🔄 Tentative de connexion pour:', email);
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('📦 Réponse du serveur:', data);

      if (!res.ok) throw new Error(data.message || 'Erreur connexion');

      // Stocker token + user localement
      localStorage.setItem('token', data.token);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('✅ Utilisateur connecté:', {
        email: data.user.email,
        role: data.user.role,
        isAdmin: data.user.role === 'admin'
      });

      toast({ title: 'Connexion réussie' });

      // Redirection avec logs de debug
      if (data.user.role === 'admin') {
        console.log('🚀 Redirection vers /admin (utilisateur admin)');
        navigate('/admin');
      } else {
        console.log('🚀 Redirection vers / (utilisateur normal)');
        navigate('/');
      }

      return true;
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      toast({
        title: 'Erreur de connexion',
        description:
          error instanceof Error ? error.message : 'Erreur inconnue',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, firstName, lastName }),
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur d'inscription");

      toast({
        title: "Inscription réussie",
        description: "Vous pouvez maintenant vous connecter",
      });
      return true;
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description:
          error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/admin');
  };

  const updateUser = async (updates: Partial<User>) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Non authentifié");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Erreur mise à jour profil");
    const data = await res.json();
    setUser(data.data);
    localStorage.setItem('user', JSON.stringify(data.data));
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Non authentifié");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Erreur changement mot de passe");
    }
  };

  const updateAvatar = async (file: File) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Non authentifié");

    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Erreur upload avatar");

    const data = await res.json();
    setUser(data.data);
    localStorage.setItem('user', JSON.stringify(data.data));
  };

  const deleteAvatar = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Non authentifié");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/avatar`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Erreur suppression avatar");

    const data = await res.json();
    setUser(data.data);
    localStorage.setItem('user', JSON.stringify(data.data));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
        updateUser,
        changePassword,
        updateAvatar,
        deleteAvatar
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
