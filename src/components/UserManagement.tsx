import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { User, Trash2, Search, Crown, RefreshCw } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  role?: 'admin' | 'user';
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/api/users'); // 👈 ton endpoint pour les utilisateurs
      setUsers(data || []);

      if ((data || []).length === 0) {
        toast({
          title: "Aucun utilisateur trouvé",
          description: "Il n'y a actuellement aucun utilisateur inscrit.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de charger les utilisateurs: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshUsers = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    toast({
      title: "Données actualisées",
      description: "La liste des utilisateurs a été mise à jour",
    });
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      await api.put(`/api/users/${userId}/role`, { role: newRole }); // 👈 adapter selon ton API
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));
      toast({
        title: "Rôle mis à jour",
        description: `L'utilisateur est maintenant ${newRole === 'admin' ? 'administrateur' : 'utilisateur'}`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le rôle: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/api/users/${userId}`);
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer l'utilisateur: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName || '';
    const last = lastName || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || 'U';
  };

  const getDisplayName = (firstName: string | null, lastName: string | null) => {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return 'Nom non renseigné';
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = getDisplayName(user.first_name, user.last_name).toLowerCase();
    const email = user.email.toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  if (isLoading) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vilo-purple-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement des utilisateurs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-gray-800 dark:text-gray-100">
            <User className="w-5 h-5 mr-2" />
            Gestion des Utilisateurs ({filteredUsers.length})
          </CardTitle>
          <Button onClick={refreshUsers} disabled={isRefreshing} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="space-y-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="border dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar_url || ''} alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 text-white">
                      {getInitials(user.first_name, user.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{getDisplayName(user.first_name, user.last_name)}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                    {user.phone && <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</p>}
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Membre depuis: {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}>
                    {user.role === 'admin' ? <><Crown className="w-3 h-3 mr-1" />Admin</> : <><User className="w-3 h-3 mr-1" />Utilisateur</>}
                  </Badge>

                  <Select value={user.role} onValueChange={(value: 'admin' | 'user') => updateUserRole(user.id, value)}>
                    <SelectTrigger className="w-32 dark:bg-gray-600 dark:border-gray-500 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)} className="h-8 w-8 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
