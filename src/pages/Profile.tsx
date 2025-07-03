import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Save, 
  Lock, 
  LogOut,
  ArrowLeft,
  Trash2,
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateUser({
        firstName,
        lastName,
        phone
      });

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Implémentez cette fonction dans votre useAuth
      // await changePassword(currentPassword, newPassword);
      toast({
        title: "Succès",
        description: "Mot de passe changé avec succès",
      });
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      // Implémentez cette fonction dans votre useAuth
      // await updateAvatar(file);
      toast({
        title: "Succès",
        description: "Photo de profil mise à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec du téléchargement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      try {
        setIsLoading(true);
        // Implémentez cette fonction dans votre useAuth
        // await deleteAvatar();
        toast({
          title: "Succès",
          description: "Photo de profil supprimée",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Échec de la suppression",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mon Profil
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button
              onClick={logout}
              variant="outline"
              className="border-red-200 dark:border-red-700 text-red-600 dark:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <User className="w-5 h-5 mr-2" />
              Informations du profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.avatar || ''} />
                  <AvatarFallback className="bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 text-white text-lg">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Upload Button */}
                <button
                  onClick={handleAvatarClick}
                  disabled={isLoading}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-vilo-purple-600 hover:bg-vilo-purple-700 disabled:bg-gray-400 rounded-full flex items-center justify-center transition-colors"
                  title="Changer la photo"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="w-4 h-4 text-white" />
                  )}
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {firstName && lastName 
                    ? `${firstName} ${lastName}`
                    : 'Utilisateur'
                  }
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                
                {/* Avatar Actions */}
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAvatarClick}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    {isLoading ? 'Upload...' : 'Changer'}
                  </Button>
                  
                  {user?.avatar && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDeleteAvatar}
                      disabled={isLoading}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Supprimer
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="Prénom"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="pl-10 bg-gray-50 dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFirstName(user?.firstName || '');
                      setLastName(user?.lastName || '');
                      setPhone(user?.phone || '');
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-vilo-purple-600 hover:bg-vilo-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                >
                  Modifier le profil
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Lock className="w-5 h-5 mr-2" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isChangingPassword ? (
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Mot de passe</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Modifiez votre mot de passe pour sécuriser votre compte
                  </p>
                </div>
                <Button
                  onClick={() => setIsChangingPassword(true)}
                  variant="outline"
                >
                  Changer le mot de passe
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Mot de passe actuel"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="bg-vilo-purple-600 hover:bg-vilo-purple-700"
                  >
                    {isLoading ? 'Modification...' : 'Changer le mot de passe'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;