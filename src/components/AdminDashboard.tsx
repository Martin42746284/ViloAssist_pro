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
  Phone, 
  User, 
  Clock, 
  CheckCircle, 
  Search,
  Send,
  Eye,
  Filter,
  RefreshCw,
  LogOut,
  Shield,
  AlertCircle,
  Wifi,
  WifiOff
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
  const [activeTab, setActiveTab] = useState('contacts');
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const [confirmedEmails, setConfirmedEmails] = useState<Record<string, boolean>>({});

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

  const sendEmailConfirmation = async (
    email: string, 
    name: string, 
    type: 'contact' | 'appointment', 
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
    // Implémentez la version texte ici
    return type === 'contact' 
      ? `Nouveau message de ${data.nom || name}`
      : `Rendez-vous confirmé pour le ${data.date || 'date non spécifiée'}`;
  };

  const buildEmailHtml = (type: string, data: any): string => {
    // Implémentez la version HTML ici
    return `
      <html>
        <body>
          <h1>${type === 'contact' ? 'Nouveau contact' : 'Confirmation'}</h1>
          <p>Détails : ${JSON.stringify(data)}</p>
        </body>
      </html>
    `;
  };

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

      if (status === 'confirmé') {
        const appointment = appointments.find(a => a.id === id);
        if (appointment) {
          await sendEmailConfirmation(
            appointment.client_email, 
            appointment.client_name, 
            'appointment', 
            {
              date: new Date(appointment.date).toLocaleDateString('fr-FR'),
              time: appointment.time
            }
          );
        }
      }

      toast({
        title: "Statut mis à jour",
        description: "Le statut du rendez-vous a été modifié",
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      nouveau: { color: 'bg-blue-500 hover:bg-blue-600', text: 'Nouveau' },
      traité: { color: 'bg-yellow-500 hover:bg-yellow-600', text: 'Traité' },
      fermé: { color: 'bg-green-500 hover:bg-green-600', text: 'Fermé' },
      en_attente: { color: 'bg-orange-500 hover:bg-orange-600', text: 'En attente' },
      confirmé: { color: 'bg-green-500 hover:bg-green-600', text: 'Confirmé' },
      annulé: { color: 'bg-red-500 hover:bg-red-600', text: 'Annulé' },
      terminé: { color: 'bg-gray-500 hover:bg-gray-600', text: 'Terminé' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-500', text: status };

    return (
      <Badge className={`${config.color} text-white transition-colors`}>
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
                           contact.service.toLowerCase().includes(searchTerm.toLowerCase());
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

  const renderContactActions = (contact: Contact) => (
    <div className="flex flex-wrap gap-2">
      {contact.status === 'nouveau' && (
        <Button
          size="sm"
          onClick={() => updateContactStatus(contact.id, 'traité')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          <Eye className="w-4 h-4 mr-1" />
          Marquer comme traité
        </Button>
      )}
      {contact.status === 'traité' && (
        <Button
          size="sm"
          onClick={() => updateContactStatus(contact.id, 'fermé')}
          className="bg-green-500 hover:bg-green-600 text-white"
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
        className="border-vilo-purple-300 text-vilo-purple-600 hover:bg-vilo-purple-50 dark:border-vilo-purple-400 dark:text-vilo-purple-400 dark:hover:bg-vilo-purple-900/20"
      >
        <Send className="w-4 h-4 mr-1" />
        {confirmedEmails[contact.email] ? "Contact déjà confirmé" : "Envoyer email"}
      </Button>
    </div>
  );

  const renderAppointmentActions = (appointment: Appointment) => (
    <div className="flex flex-wrap gap-2">
      {appointment.status === 'en_attente' && (
        <>
          <Button
            size="sm"
            onClick={() => updateAppointmentStatus(appointment.id, 'confirmé')}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Confirmer
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => updateAppointmentStatus(appointment.id, 'annulé')}
          >
            Annuler
          </Button>
        </>
      )}
      {appointment.status === 'confirmé' && (
        <Button
          size="sm"
          onClick={() => updateAppointmentStatus(appointment.id, 'terminé')}
          className="bg-gray-600 hover:bg-gray-700 text-white"
        >
          Terminé
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        onClick={() => sendEmailConfirmation(appointment.client_email, appointment.client_name, 'appointment', {
          date: new Date(appointment.date).toLocaleDateString('fr-FR'),
          time: appointment.time
        })}
        disabled={confirmedEmails[appointment.client_email]}
        className="border-vilo-purple-300 text-vilo-purple-600 hover:bg-vilo-purple-50 dark:border-vilo-purple-400 dark:text-vilo-purple-400 dark:hover:bg-vilo-purple-900/20"
      >
        <Send className="w-4 h-4 mr-1" />
        {confirmedEmails[appointment.client_email] ? "Rendez-vous déjà confirmé" : "Envoyer email"}
      </Button>
    </div>
  );

  if (isLoading && contacts.length === 0 && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vilo-purple-600 mx-auto mb-4"></div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tableau de bord Admin</h1>
          <div className="flex items-center space-x-4">
            {getDataFreshnessIndicator()}
            <Button
              onClick={refreshData}
              disabled={isRefreshing}
              className="bg-vilo-purple-600 hover:bg-vilo-purple-700 text-white"
            >
              {isRefreshing ? 'Actualisation...' : 'Actualiser'}
            </Button>
            <Button onClick={logout} variant="destructive">
              Déconnexion
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Contacts</CardTitle>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="all">Tous</option>
                    <option value="nouveau">Nouveau</option>
                    <option value="traité">Traité</option>
                    <option value="fermé">Fermé</option>
                  </select>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredContacts.map(contact => (
                    <div key={contact.id} className="border dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{contact.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{contact.email}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{contact.service}</p>
                      {getStatusBadge(contact.status)}
                      <div className="mt-3">{renderContactActions(contact)}</div>
                    </div>
                  ))}
                  {filteredContacts.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 col-span-full">
                      {contacts.length === 0 ? 'Aucun contact à afficher' : 'Aucun contact trouvé avec ces filtres'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Rendez-vous</CardTitle>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                    className="flex-grow"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="all">Tous</option>
                    <option value="en_attente">En attente</option>
                    <option value="confirmé">Confirmé</option>
                    <option value="annulé">Annulé</option>
                    <option value="terminé">Terminé</option>
                  </select>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredAppointments.map(appointment => (
                    <div key={appointment.id} className="border dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{appointment.client_name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{appointment.client_email}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{new Date(appointment.date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{appointment.time}</p>
                      {getStatusBadge(appointment.status)}
                      <div className="mt-3">{renderAppointmentActions(appointment)}</div>
                    </div>
                  ))}
                  {filteredAppointments.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 col-span-full">
                      {appointments.length === 0 ? 'Aucun rendez-vous à afficher' : 'Aucun rendez-vous trouvé avec ces filtres'}
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