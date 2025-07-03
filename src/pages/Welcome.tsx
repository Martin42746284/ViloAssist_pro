
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles,
  CheckCircle,
  Star,
  ArrowRight,
  Clock,
  Globe,
  Users,
  LogIn,
  UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Welcome = () => {
  const features = [
    {
      icon: Clock,
      title: "Service 24/7",
      description: "Support continu pour votre entreprise",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Star,
      title: "Tarif unique",
      description: "10€/h pour tous nos services",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Globe,
      title: "Sécurisé",
      description: "Vos données sont protégées",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Users,
      title: "Équipe experte",
      description: "Professionnels qualifiés",
      color: "from-orange-500 to-red-600"
    }
  ];

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-vilo-purple-50 via-white to-vilo-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-700">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-vilo-purple-400/20 to-vilo-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-vilo-pink-400/20 to-vilo-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-3 animate-fade-in">
          <div className="w-12 h-12 bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 rounded-xl flex items-center justify-center shadow-lg animate-scale-in">
            <Sparkles className="w-7 h-7 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 bg-clip-text text-transparent">
            VILO ASSIST-PRO
          </h1>
        </div>
        <div className="animate-fade-in delay-300">
          <ThemeToggle />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Welcome Content */}
          <div className="space-y-8 animate-fade-in delay-500">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Bienvenue chez{' '}
                <span className="bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 bg-clip-text text-transparent animate-pulse">
                  VILO ASSIST-PRO
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Votre partenaire de confiance pour l'assistance virtuelle professionnelle. 
                Découvrez nos services d'exception basés à Madagascar.
              </p>
              <div className="flex items-center space-x-4 animate-slide-in-right delay-700">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 bg-gradient-to-r from-vilo-purple-400 to-vilo-pink-400 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white font-semibold animate-bounce`}
                      style={{ animationDelay: `${i * 200}ms` }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-vilo-purple-600 dark:text-vilo-purple-400">+500</span> clients satisfaits
                </div>
              </div>
            </div>

            {/* Animated Features */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${800 + index * 150}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-vilo-purple-600 dark:group-hover:text-vilo-purple-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-vilo-purple-600/5 to-vilo-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in delay-1000">
              <Link to="/auth">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 hover:from-vilo-purple-700 hover:to-vilo-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  Commencer maintenant
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Essai gratuit • Sans engagement
              </div>
            </div>
          </div>

          {/* Right Side - Auth Buttons Card */}
          <div className="flex justify-center animate-fade-in delay-700">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg hover:shadow-3xl transition-all duration-500 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Accédez à votre espace
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Connectez-vous ou créez votre compte pour commencer
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Sign In Button */}
                <Link to="/auth">
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 hover:from-vilo-purple-700 hover:to-vilo-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <LogIn className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    Se connecter
                  </Button>
                </Link>

                {/* Sign Up Button */}
                <Link to="/auth">
                  <Button 
                    variant="outline"
                    className="w-full h-12 border-2 border-vilo-purple-300 dark:border-vilo-purple-400 text-vilo-purple-600 dark:text-vilo-purple-400 hover:bg-vilo-purple-50 dark:hover:bg-vilo-purple-900/20 font-medium transition-all duration-300 group"
                  >
                    <UserPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Créer un compte
                  </Button>
                </Link>

                {/* Features Preview */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Accès immédiat à tous nos services</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Support client 24h/7j</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Tarification transparente à 10€/h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Statistics */}
        <div className="mt-20 text-center animate-fade-in delay-1200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "500+", label: "Clients satisfaits" },
              { number: "24/7", label: "Support disponible" },
              { number: "10€", label: "Tarif unique /h" },
              { number: "5+", label: "Années d'expérience" }
            ].map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
