import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth'; // Suppose que vous avez un hook d'authentification

export const useAvatar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // Récupère l'utilisateur connecté

  const uploadAvatar = async (file: File) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', user.id);

      const response = await fetch('http://localhost:5000/api/users/avatar', {
        method: 'POST',
        body: formData,
        // Les credentials sont importants pour les cookies d'authentification
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      toast({ title: 'Avatar mis à jour avec succès' });
      return data.avatarUrl;
      
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Échec de la mise à jour de l'avatar",
        variant: 'destructive'
      });
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadAvatar, isLoading };
};