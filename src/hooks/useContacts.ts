import { useState } from 'react';
import { api } from '@/lib/api';
import { ContactFormData } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export const useContacts = () => {
  const [isLoading, setIsLoading] = useState(false);

  const submitContact = async (contactData: ContactFormData) => {
    setIsLoading(true);
    try {
      // Envoyer les données à votre API Node.js
      const response = await api.post('/contacts', contactData);

      // Envoyer email de confirmation (optionnel)
      try {
        await api.post('/notifications/send-email', {
          to: contactData.email,
          name: contactData.name,
          type: 'contact',
          data: {
            service: contactData.service,
            message: contactData.message
          }
        });
      } catch (emailError) {
        console.log('Erreur envoi email (non bloquant):', emailError);
        // L'erreur d'email n'est pas bloquante
      }

      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });

      return { success: true, data: response };
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du contact:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
      
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour récupérer tous les contacts
  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const contacts = await api.get('/contacts');
      return { success: true, data: contacts };
    } catch (error: any) {
      console.error('Erreur lors de la récupération des contacts:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les contacts.",
        variant: "destructive",
      });
      
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour mettre à jour un contact
  const updateContact = async (id: string, updateData: Partial<ContactFormData>) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/contacts/${id}`, updateData);
      
      toast({
        title: "Contact modifié",
        description: "Les modifications ont été sauvegardées.",
      });
      
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Erreur lors de la modification du contact:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le contact.",
        variant: "destructive",
      });
      
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer un contact
  const deleteContact = async (id: string) => {
    setIsLoading(true);
    try {
      await api.delete(`/contacts/${id}`);
      
      toast({
        title: "Contact supprimé",
        description: "Le contact a été supprimé avec succès.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Erreur lors de la suppression du contact:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le contact.",
        variant: "destructive",
      });
      
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour récupérer un contact par ID
  const getContactById = async (id: string) => {
    setIsLoading(true);
    try {
      const contact = await api.get(`/contacts/${id}`);
      return { success: true, data: contact };
    } catch (error: any) {
      console.error('Erreur lors de la récupération du contact:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger le contact.",
        variant: "destructive",
      });
      
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitContact,
    fetchContacts,
    updateContact,
    deleteContact,
    getContactById,
    isLoading
  };
};