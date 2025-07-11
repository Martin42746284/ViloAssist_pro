import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { Contact, Appointment } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { 
  Calendar, 
  Mail, 
  Trash2, 
  User, 
  Clock, 
  CheckCircle, 
  Search,
  Send,
  Eye,
  Sun,
  RefreshCw,
  LogOut,
  Shield,
  AlertCircle,
  Wifi,
  WifiOff,
  Users,
  CalendarDays,
  Moon,
  Activity,
  X,
  ChevronDown,
  MessageSquare,
  Plus,
  Settings,
  BarChart3
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { debounce } from 'lodash';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [confirmedEmails, setConfirmedEmails] = useState<Record<string, boolean>>({});
  const [darkMode, setDarkMode] = useState(true);

  // Surveillance de la connexion
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

    // Appliquer le mode sombre au body
    useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Validation des données
  const validateContacts = (data: any): Contact[] => {
    if (!Array.isArray(data)) {
      console.warn('Données contacts invalides:', data);
      return [];
    }
    
    return data.filter(contact => {
      const isValid = contact.id && 
                     contact.name && 
                     contact.email && 
                     contact.status &&
                     ['nouveau', 'traité', 'fermé'].includes(contact.status);
      
      if (!isValid) {
        console.warn('Contact invalide filtré:', contact);
      }
      
      return isValid;
    });
  };

  const validateAppointments = (data: any): Appointment[] => {
    if (!Array.isArray(data)) {
      console.warn('Données rendez-vous invalides:', data);
      return [];
    }
    
    return data.filter(appointment => {
      const isValid = appointment.id && 
                     appointment.client_name && 
                     appointment.client_email && 
                     appointment.date && 
                     appointment.status &&
                     ['en_attente', 'confirmé', 'annulé', 'terminé'].includes(appointment.status);
      
      if (!isValid) {
        console.warn('Rendez-vous invalide filtré:', appointment);
      }
      
      return isValid;
    });
  };

  // Fonction de retry avec backoff exponentiel
  const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3): Promise<any> => {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        if (i === maxRetries) throw error;
        
        // Ne pas retry sur les erreurs d'authentification
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw error;
        }
        
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        console.log(`Tentative ${i + 1} échouée, retry dans ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

   const fetchData = async (options: { forceRefresh?: boolean } = {}) => {
    const { forceRefresh = false } = options;

    if (!isOnline) {
      toast({
        title: "Hors ligne",
        description: "Connexion internet requise pour charger les données",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRetryCount(0);

    try {
      const startTime = Date.now();

      const fetchWithRetry = () =>
        Promise.all([
          api.get('/admin/contacts'),
          api.get('/admin/appointments'),
        ]);

      const [contactsResponse, appointmentsResponse] = await retryWithBackoff(fetchWithRetry);

      console.log('Réponse contacts brute:', contactsResponse);
      console.log('Réponse rendez-vous brute:', appointmentsResponse);

      // Validation que ce sont bien des tableaux
      const validatedContacts = Array.isArray(contactsResponse)
        ? validateContacts(contactsResponse)
        : [];

      const validatedAppointments = Array.isArray(appointmentsResponse)
        ? validateAppointments(appointmentsResponse)
        : [];

      setContacts(validatedContacts);
      setAppointments(validatedAppointments);
      setLastSyncTime(Date.now());

      // Initialiser confirmedEmails avec les emails déjà confirmés
      const confirmedEmailsMap: Record<string, boolean> = {};
      
      // Pour les contacts
      validatedContacts.forEach((contact: Contact) => {
        if (contact.status === 'traité' || contact.status === 'fermé') {
          confirmedEmailsMap[contact.email] = true;
        }
      });

      // Pour les rendez-vous
      validatedAppointments.forEach((appointment: Appointment) => {
        if (appointment.status === 'confirmé' || appointment.status === 'terminé') {
          confirmedEmailsMap[appointment.client_email] = true;
        }
      });

      setConfirmedEmails(confirmedEmailsMap);

      const duration = Date.now() - startTime;
      console.log(`Données chargées en ${duration}ms - Contacts: ${validatedContacts.length}, Rendez-vous: ${validatedAppointments.length}`);

      if (forceRefresh) {
        toast({
          title: "Données actualisées",
          description: `${validatedContacts.length} contacts et ${validatedAppointments.length} rendez-vous chargés`,
        });
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des données:', error);

      // Gestion d'erreur plus robuste, fetch native n'a pas toujours error.response
      const status = error.response?.status || (error.status || 0);

      if (status === 401) {
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
        });
        logout();
        return;
      }

      if (status === 403) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires",
          variant: "destructive",
        });
        return;
      }

      if (status >= 500) {
        toast({
          title: "Erreur serveur",
          description: "Le serveur rencontre des difficultés. Réessayez dans quelques instants.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur de chargement",
          description: error.response?.data?.message || error.message || "Impossible de charger les données",
          variant: "destructive",
        });
      }

      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

   // Auto-refresh des données toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const fiveMinutesAgo = now - (5 * 60 * 1000);
      
      if (lastSyncTime && lastSyncTime < fiveMinutesAgo && isOnline) {
        fetchData({ forceRefresh: true });
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [lastSyncTime, isOnline]);

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchData({ forceRefresh: true });
    setIsRefreshing(false);
  };

  //Fonction pour l'envoie de l'email
  const sendEmailConfirmation = async (
    email: string, 
    name: string, 
    type: 'contact' | 'appointment' |'appointment-confirmation' |'appointment-cancellation', 
    data?: any
  ) => {
    try {
      // 1. Payload avec valeur par défaut statique
      const payload = {
        to: email,
        from: 'manampisoa.m@zurcher.edu.mg', // email d'envoie
        subject: `${type === 'contact' ? 'Nouveau contact' : 'Confirmation rendez-vous'} - ${name}`,
        text: buildEmailText(type, data), // Version texte
        html: buildEmailHtml(type, data), // Version HTML
        name,
        type,
        ...(data && { data })
      };

      console.log("Envoi email avec payload:", payload);

      // 2. Envoi simplifié
      const response = await api.post('/admin/send-email', payload);

      if (!response.success) {
        throw new Error(response.message || "Erreur inconnue du serveur");
      }

      // Mettre à jour l'état des emails confirmés
      setConfirmedEmails(prev => ({
        ...prev,
        [email]: true
      }));

      toast({
        title: "Email envoyé",
        description: `Confirmation envoyée à ${email}`,
      });

    } catch (error: any) {
      console.error('Erreur:', {
        message: error.message,
        details: error.details || 'Aucun détail supplémentaire'
      });

      toast({
        title: "Échec d'envoi",
        description: error.message || "Erreur lors de la communication avec le serveur",
        variant: "destructive",
      });
    }
  };

    // Helper functions
  const buildEmailText = (type: string, data: any): string => {
    if (type === 'appointment-confirmation') {
      return `Confirmation de rendez-vous\n\nBonjour ${data.name},\n\nNotre rendez-vous a été confirmé.\n\nDate: ${data.date}\nHeure: ${data.time}\n\nMerci de votre confiance.`;
    } else if (type === 'appointment-cancellation') {
      return `Annulation de rendez-vous\n\nBonjour ${data.name},\n\nNous vous informons que notre rendez-vous prévu le ${data.date} à ${data.time} a été annulé.\n\nNous sommes désolés pour ce contretemps.\n\nN'hésitez pas à prendre un nouveau rendez-vous.`;
    }
    // ... autres types d'emails
  };

  const buildEmailHtml = (type: string, data: any): string => {
    if (type === 'appointment-confirmation') {
      return `
        <html>
          <body>
            <h1>Confirmation de rendez-vous</h1>
            <p>Bonjour ${data.name},</p>
            <p>Votre rendez-vous pour le service <strong>${data.service}</strong> a été confirmé.</p>
            <p>Date: <strong>${data.date}</strong></p>
            <p>Heure: <strong>${data.time}</strong></p>
            <p>Merci de votre confiance.</p>
          </body>
        </html>
      `;
    } else if (type === 'appointment-cancellation') {
      return `
        <html>
          <body>
            <h1>Annulation de rendez-vous</h1>
            <p>Bonjour ${data.name},</p>
            <p>Nous vous informons que votre rendez-vous pour le service <strong>${data.service}</strong> prévu le ${data.date} à ${data.time} a été annulé.</p>
            <p>Nous sommes désolés pour ce contretemps.</p>
            <p>N'hésitez pas à prendre un nouveau rendez-vous.</p>
          </body>
        </html>
      `;
    }
  };

  //Fonction pour la modification
  const updateContactStatus = async (id: string, status: 'nouveau' | 'traité' | 'fermé') => {
    try {
      const previousContacts = [...contacts];
      setContacts(prev => prev.map(contact =>
        contact.id === id ? { ...contact, status } : contact
      ));

      const response = await retryWithBackoff(() => 
        api.put(`/admin/contacts/${id}`, { status })
      );
      
      if (status === 'traité') {
        const contact = contacts.find(c => c.id === id);
        if (contact) {
          await sendEmailConfirmation(contact.email, contact.name, 'contact', {
            service: contact.service,
            message: contact.message
          });
        }
      }

      toast({
        title: "Statut mis à jour",
        description: "Le statut du contact a été modifié",
      });
    } catch (error: any) {
      setContacts(contacts);
      
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de mettre à jour",
        variant: "destructive",
      });
    }
  };

  const updateAppointmentStatus = async (id: string, status: 'en_attente' | 'confirmé' | 'annulé' | 'terminé') => {
    try {
      const previousAppointments = [...appointments];
      setAppointments(prev => prev.map(appointment =>
        appointment.id === id ? { ...appointment, status } : appointment
      ));

      const response = await retryWithBackoff(() => 
        api.put(`/admin/appointments/${id}`, { status })
      );

      // Envoyer email automatiquement selon le statut
      const appointment = appointments.find(a => a.id === id);
      if (appointment) {
        if (status === 'confirmé') {
          await sendEmailConfirmation(
            appointment.client_email, 
            appointment.client_name, 
            'appointment-confirmation', // Nouveau type pour le template de confirmation
            {
              date: new Date(appointment.date).toLocaleDateString('fr-FR'),
              time: appointment.time,
            }
          );
        } else if (status === 'annulé') {
          await sendEmailConfirmation(
            appointment.client_email, 
            appointment.client_name, 
            'appointment-cancellation', // Nouveau type pour le template d'annulation
            {
              date: new Date(appointment.date).toLocaleDateString('fr-FR'),
              time: appointment.time,
            }
          );
        }
      }

      toast({
        title: "Statut mis à jour",
        description: `Le rendez-vous a été ${status}${status === 'confirmé' || status === 'annulé' ? ' et un email a été envoyé au client' : ''}`,
      });
    } catch (error: any) {
      setAppointments(appointments);
      
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de mettre à jour",
        variant: "destructive",
      });
    }
  };

  //Fonctions pour les suppressions
  const deleteContact = async (id: string) => {
    try {
      // Confirmation utilisateur
      const confirmDelete = window.confirm(
        "Cette action supprimera définitivement le contact de la base de données. Continuer ?"
      );
      if (!confirmDelete) return;

      // Optimistic UI update
      const previousContacts = [...contacts];
      setContacts(prev => prev.filter(contact => contact.id !== id));

      // Appel API
      const response = await api.delete(`/contacts/${id}`);

      if (!response.success) {
        throw new Error(response.message || "Erreur lors de la suppression");
      }

      // Notification
      toast({
        title: "Suppression réussie",
        description: response.message || "Le contact a été supprimé de la base de données",
        variant: "default",
      });

    } catch (error: any) {
      // Rollback en cas d'erreur
      setContacts(contacts);
      
      // Notification d'erreur
      toast({
        title: "Échec de la suppression",
        description: error.response?.data?.message || 
                    error.message || 
                    "Erreur lors de la suppression du contact",
        variant: "destructive",
      });

      // Rechargement des données si nécessaire
      if (error.response?.status === 404 || error.response?.status === 410) {
        fetchData();
      }
    }
  };

  // Fonction de suppression dans votre composant React
  const deleteAppointment = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        "Voulez-vous vraiment supprimer définitivement ce rendez-vous ?"
      );
      if (!confirmDelete) return;

      // Optimistic update
      setAppointments(prev => prev.filter(a => a.id !== id));

      const response = await api.delete(`/appointments/${id}`);

      if (!response.success) {
        throw new Error(response.message);
      }

      toast({
        title: "Succès",
        description: "Le rendez-vous a été supprimé",
        variant: "default",
      });

    } catch (error) {
      // Rollback
      fetchData();
      
      toast({
        title: "Erreur",
        description: error.message || "Échec de la suppression",
        variant: "destructive",
      });
    }
  };

  // Mettre à jour getStatusBadge pour le mode sombre
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      nouveau: { 
        light: 'bg-blue-100 text-blue-800 border-blue-200',
        dark: 'bg-blue-900/20 text-blue-300 border-blue-800/30',
        text: 'Nouveau', 
        icon: Plus 
      },
      traité: { 
        light: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        dark: 'bg-yellow-900/20 text-yellow-300 border-yellow-800/30',
        text: 'Traité', 
        icon: Eye 
      },
      fermé: { 
        light: 'bg-green-100 text-green-800 border-green-200',
        dark: 'bg-green-900/20 text-green-300 border-green-800/30',
        text: 'Fermé', 
        icon: CheckCircle 
      },
      en_attente: { 
        light: 'bg-orange-100 text-orange-800 border-orange-200',
        dark: 'bg-orange-900/20 text-orange-300 border-orange-800/30',
        text: 'En attente', 
        icon: Clock 
      },
      confirmé: { 
        light: 'bg-green-100 text-green-800 border-green-200',
        dark: 'bg-green-900/20 text-green-300 border-green-800/30',
        text: 'Confirmé', 
        icon: CheckCircle 
      },
      annulé: { 
        light: 'bg-red-100 text-red-800 border-red-200',
        dark: 'bg-red-900/20 text-red-300 border-red-800/30',
        text: 'Annulé', 
        icon: X 
      },
      terminé: { 
        light: 'bg-gray-100 text-gray-800 border-gray-200',
        dark: 'bg-gray-800 text-gray-300 border-gray-700',
        text: 'Terminé', 
        icon: CheckCircle 
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      light: 'bg-gray-100 text-gray-800 border-gray-200',
      dark: 'bg-gray-800 text-gray-300 border-gray-700',
      text: status, 
      icon: Activity 
    };
    const IconComponent = config.icon;

    return (
      <Badge className={`${darkMode ? config.dark : config.light} border font-medium px-3 py-1 rounded-full flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  // Debounced search
  const debouncedSetSearchTerm = useCallback(
    debounce((term: string) => setSearchTerm(term), 300),
    []
  );

  // Mémorisation des données filtrées
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchTerm, statusFilter]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = appointment.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.client_email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  // Statistiques pour le dashboard
  const stats = useMemo(() => {
    const totalContacts = contacts.length;
    const newContacts = contacts.filter(c => c.status === 'nouveau').length;
    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter(a => a.status === 'en_attente').length;
    
    return {
      totalContacts,
      newContacts,
      totalAppointments,
      pendingAppointments,
      contactsProcessed: contacts.filter(c => c.status === 'traité').length,
      appointmentsConfirmed: appointments.filter(a => a.status === 'confirmé').length
    };
  }, [contacts, appointments]);

  // Indicateur de fraîcheur des données
  const getDataFreshnessIndicator = () => {
    if (!lastSyncTime) return null;
    
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    const isStale = lastSyncTime < fiveMinutesAgo;
    
    return (
      <div className={`flex items-center text-xs ${isStale ? 'text-yellow-600' : 'text-green-600'}`}>
        {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
        Dernière sync: {new Date(lastSyncTime).toLocaleTimeString('fr-FR')}
        {isStale && <AlertCircle className="w-3 h-3 ml-1" />}
      </div>
    );
  };

  if (isLoading && contacts.length === 0 && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-cyan-400 animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              </div>
              <p className="text-gray-600 text-lg font-medium">
                Chargement des données...
              </p>
              {retryCount > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Tentative {retryCount + 1}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mettre à jour renderContactActions pour le mode sombre
  const renderContactActions = (contact: Contact) => (
    <div className="flex flex-wrap gap-2">
      {contact.status === 'nouveau' && (
        <Button
          size="sm"
          onClick={() => updateContactStatus(contact.id, 'traité')}
          className="bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-700 dark:hover:bg-yellow-800"
        >
          <Eye className="w-4 h-4 mr-1" />
          Marquer comme traité
        </Button>
      )}
      {contact.status === 'traité' && (
        <Button
          size="sm"
          onClick={() => updateContactStatus(contact.id, 'fermé')}
          className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Fermer
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={() => sendEmailConfirmation(contact.email, contact.name, 'contact', {
          service: contact.service,
          message: contact.message
        })}
        disabled={confirmedEmails[contact.email]}
        className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
      >
        <Send className="w-4 h-4 mr-1" />
        {confirmedEmails[contact.email] ? "Contact déjà confirmé" : "Envoyer email"}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => deleteContact(contact.id)}
        className="hover:bg-red-600 hover:text-white dark:hover:bg-red-700"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Supprimer
      </Button>
    </div>
  );

  // Mettre à jour renderAppointmentActions pour le mode sombre
  const renderAppointmentActions = (appointment: Appointment) => (
    <div className="flex flex-wrap gap-2">
      {appointment.status === 'en_attente' && (
        <>
          <Button
            size="sm"
            onClick={() => updateAppointmentStatus(appointment.id, 'confirmé')}
            className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Confirmer
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => updateAppointmentStatus(appointment.id, 'annulé')}
            className="dark:hover:bg-red-700"
          >
            Annuler
          </Button>
        </>
      )}
      {appointment.status === 'confirmé' && (
        <Button
          size="sm"
          onClick={() => updateAppointmentStatus(appointment.id, 'terminé')}
          className="bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-800"
        >
          Terminé
        </Button>
      )}
      <Button
        size="sm"
        variant="destructive"
        onClick={() => deleteAppointment(appointment.id)}
        className="hover:bg-red-600 hover:text-white dark:hover:bg-red-700"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Supprimer
      </Button>
    </div>
  );

  if (isLoading && contacts.length === 0 && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Chargement des données...
                {retryCount > 0 && ` (Tentative ${retryCount + 1})`}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-[#7F00FF] via-[#E100FF] to-[#FF4B91] rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7F00FF] via-[#E100FF] to-[#FF4B91] bg-clip-text text-transparent">
                  Dashboard Admin
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Gérez vos contacts et rendez-vous</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              {getDataFreshnessIndicator()}
              <Button
                onClick={refreshData}
                disabled={isRefreshing}
                className="bg-gradient-to-r from-[#7F00FF] via-[#E100FF] to-[#FF4B91] hover:brightness-110 text-white border-0 shadow-md hover:shadow-lg transition-all"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:border-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7F00FF] data-[state=active]:via-[#E100FF] data-[state=active]:to-[#FF4B91] data-[state=active]:text-white rounded-lg px-6 py-3 font-medium transition-all"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger 
              value="contacts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7F00FF] data-[state=active]:via-[#E100FF] data-[state=active]:to-[#FF4B91] data-[state=active]:text-white rounded-lg px-6 py-3 font-medium transition-all"
            >
              <Users className="w-4 h-4 mr-2" />
              Contacts ({contacts.length})
            </TabsTrigger>
            <TabsTrigger 
              value="appointments"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7F00FF] data-[state=active]:via-[#E100FF] data-[state=active]:to-[#FF4B91] data-[state=active]:text-white rounded-lg px-6 py-3 font-medium transition-all"
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              Rendez-vous ({appointments.length})
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-md hover:shadow-lg transition-all dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Contacts</p>
                      <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">{stats.totalContacts}</p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-full dark:bg-blue-600">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-yellow-100 border-orange-200 shadow-md hover:shadow-lg transition-all dark:from-orange-900/20 dark:to-yellow-900/20 dark:border-orange-800/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Nouveaux</p>
                      <p className="text-3xl font-bold text-orange-800 dark:text-orange-200">{stats.newContacts}</p>
                    </div>
                    <div className="p-3 bg-orange-500 rounded-full dark:bg-orange-600">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-md hover:shadow-lg transition-all dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Rendez-vous</p>
                      <p className="text-3xl font-bold text-green-800 dark:text-green-200">{stats.totalAppointments}</p>
                    </div>
                    <div className="p-3 bg-green-500 rounded-full dark:bg-green-600">
                      <CalendarDays className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 shadow-md hover:shadow-lg transition-all dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-800/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">En attente</p>
                      <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">{stats.pendingAppointments}</p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-full dark:bg-purple-600">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activité récente */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all border-0 dark:border dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Contacts récents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contacts.slice(0, 3).map(contact => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{contact.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{contact.service}</p>
                        </div>
                      </div>
                      {getStatusBadge(contact.status)}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all border-0 dark:border dark:border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Prochains rendez-vous
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointments.slice(0, 3).map(appointment => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <CalendarDays className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{appointment.client_name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(appointment.date).toLocaleDateString('fr-FR')} à {appointment.time}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-md border-0 dark:border dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <Users className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400" />
                    Gestion des contacts
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Rechercher un contact..."
                        onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-80 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-700 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-700 transition-all"
                      >
                        <option value="all">Tous les statuts</option>
                        <option value="nouveau">Nouveau</option>
                        <option value="traité">Traité</option>
                        <option value="fermé">Fermé</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredContacts.map(contact => (
                    <div key={contact.id} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700/80 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-500">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{contact.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {contact.email}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(contact.status)}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                          <Settings className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="font-medium">Service:</span> {contact.service}
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                            <MessageSquare className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400 mt-0.5" />
                            <span>{contact.message}</span>
                          </p>
                        </div>
                      </div>
                      
                      {renderContactActions(contact)}
                    </div>
                  ))}
                  {filteredContacts.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
                        {contacts.length === 0 ? 'Aucun contact' : 'Aucun résultat'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {contacts.length === 0 
                          ? 'Les nouveaux contacts apparaîtront ici' 
                          : 'Essayez de modifier vos critères de recherche'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-md border-0 dark:border dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <CalendarDays className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400" />
                    Gestion des rendez-vous
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Rechercher un rendez-vous..."
                        onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-80 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-700 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-700 transition-all"
                      >
                        <option value="all">Tous les statuts</option>
                        <option value="en_attente">En attente</option>
                        <option value="confirmé">Confirmé</option>
                        <option value="annulé">Annulé</option>
                        <option value="terminé">Terminé</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAppointments.map(appointment => (
                    <div key={appointment.id} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700/80 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-500">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <CalendarDays className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{appointment.client_name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {appointment.client_email}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="font-medium">Date:</span> {new Date(appointment.date).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span className="font-medium">Heure:</span> {appointment.time}
                        </p>
                      </div>
                      
                      {renderAppointmentActions(appointment)}
                    </div>
                  ))}
                  {filteredAppointments.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarDays className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
                        {appointments.length === 0 ? 'Aucun rendez-vous' : 'Aucun résultat'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {appointments.length === 0 
                          ? 'Les nouveaux rendez-vous apparaîtront ici' 
                          : 'Essayez de modifier vos critères de recherche'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;