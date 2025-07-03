// import { useAuth } from '@/hooks/useAuth';
// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Separator } from '@/components/ui/separator';
// import { toast } from '@/hooks/use-toast';
// import { 
//   Shield, 
//   User, 
//   Mail, 
//   Lock, 
//   Eye, 
//   EyeOff,
//   Sparkles,
//   ArrowLeft
// } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import ThemeToggle from '@/components/ThemeToggle';

// type AuthMode = 'signin' | 'signup' | 'admin';

// const Auth = () => {
//   const [authMode, setAuthMode] = useState<AuthMode>('signin');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const { login, register } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       if (authMode === 'admin') {
//         const success = await login(email, password);
//         if (success) {
//           navigate('/admin');
//         } else {
//           toast({
//             title: "Erreur de connexion",
//             description: "Identifiants administrateur incorrects",
//             variant: "destructive",
//           });
//         }
//         return;
//       }

//       if (authMode === 'signup') {
//         const success = await register(email, password, firstName, lastName);
//         if (success) {
//           toast({
//             title: "Inscription réussie",
//             description: "Vous pouvez maintenant vous connecter",
//           });
//           setAuthMode('signin');
//         }
//       } else {
//         const success = await login(email, password);
//         if (success) {
//           navigate('/');
//         }
//       }
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: error instanceof Error ? error.message : "Une erreur est survenue",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setEmail('');
//     setPassword('');
//     setFirstName('');
//     setLastName('');
//     setShowPassword(false);
//   };

//   const switchMode = (mode: AuthMode) => {
//     setAuthMode(mode);
//     resetForm();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-vilo-purple-50 via-white to-vilo-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-700">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-vilo-purple-400/20 to-vilo-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-vilo-pink-400/20 to-vilo-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//       </div>

//       {/* Header */}
//       <div className="relative z-10 flex justify-between items-center p-6">
//         <div className="flex items-center space-x-3">
//           <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
//             <Button variant="ghost" size="icon" className="w-10 h-10">
//               <ArrowLeft className="w-5 h-5" />
//             </Button>
//             <div className="w-12 h-12 bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 rounded-xl flex items-center justify-center shadow-lg">
//               <Sparkles className="w-7 h-7 text-white" />
//             </div>
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 bg-clip-text text-transparent">
//               VILO ASSIST-PRO
//             </h1>
//           </Link>
//         </div>
//         <ThemeToggle />
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-120px)]">
//         <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
//           <CardHeader className="text-center pb-4">
//             <div className="mx-auto w-20 h-20 bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
//               {authMode === 'admin' ? (
//                 <Shield className="w-10 h-10 text-white" />
//               ) : (
//                 <User className="w-10 h-10 text-white" />
//               )}
//             </div>
//             <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
//               {authMode === 'admin' ? 'Administration' : 
//                authMode === 'signup' ? 'Créer un compte' : 'Connexion'}
//             </CardTitle>
//             <p className="text-gray-600 dark:text-gray-300 text-sm">
//               {authMode === 'admin' ? 'Accès réservé aux administrateurs' :
//                authMode === 'signup' ? 'Rejoignez notre plateforme' : 'Accédez à votre espace'}
//             </p>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             {/* Auth Mode Switcher */}
//             {authMode !== 'admin' && (
//               <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
//                 <Button
//                   type="button"
//                   variant={authMode === 'signin' ? 'default' : 'ghost'}
//                   onClick={() => switchMode('signin')}
//                   className="flex-1 h-10 text-sm"
//                 >
//                   Connexion
//                 </Button>
//                 <Button
//                   type="button"
//                   variant={authMode === 'signup' ? 'default' : 'ghost'}
//                   onClick={() => switchMode('signup')}
//                   className="flex-1 h-10 text-sm"
//                 >
//                   Inscription
//                 </Button>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Name fields for signup */}
//               {authMode === 'signup' && (
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="space-y-2">
//                     <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       Prénom
//                     </Label>
//                     <Input
//                       id="firstName"
//                       value={firstName}
//                       onChange={(e) => setFirstName(e.target.value)}
//                       placeholder="Prénom"
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       Nom
//                     </Label>
//                     <Input
//                       id="lastName"
//                       value={lastName}
//                       onChange={(e) => setLastName(e.target.value)}
//                       placeholder="Nom"
//                       className="h-11"
//                       required
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Email */}
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Email
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//                   <Input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder={authMode === 'admin' ? 'admin@viloassist.com' : 'votre@email.com'}
//                     className="pl-11 h-12"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                   Mot de passe
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="••••••••"
//                     className="pl-11 pr-12 h-12"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                   >
//                     {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                   </button>
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full h-12 bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 hover:from-vilo-purple-700 hover:to-vilo-pink-700 text-white font-medium shadow-lg"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Connexion...
//                   </div>
//                 ) : (
//                   authMode === 'signup' ? 'Créer le compte' : 'Se connecter'
//                 )}
//               </Button>
//             </form>

//             {/* Admin Access */}
//             {authMode !== 'admin' && (
//               <>
//                 <Separator />
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => switchMode('admin')}
//                   className="w-full h-11 border-vilo-purple-300 dark:border-vilo-purple-400 text-vilo-purple-600 dark:text-vilo-purple-400"
//                 >
//                   <Shield className="w-5 h-5 mr-2" />
//                   Accès Administration
//                 </Button>
//               </>
//             )}

//             {/* Demo credentials for admin */}
//             {authMode === 'admin' && (
//               <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
//                 <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
//                   <strong>Démo:</strong> admin@viloassist.com / admin123
//                 </p>
//               </div>
//             )}

//             {/* Back to user auth */}
//             {authMode === 'admin' && (
//               <Button
//                 type="button"
//                 variant="ghost"
//                 onClick={() => switchMode('signin')}
//                 className="w-full h-9 text-sm text-gray-600 dark:text-gray-400"
//               >
//                 ← Retour à l'espace utilisateur
//               </Button>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Auth;