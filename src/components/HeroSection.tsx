import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Play, Star, Shield, Zap, Users, Clock, Sparkles, Award, Target, Headphones } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const services = [
    { text: "Assistant administratif professionnel", icon: Users, color: "from-blue-400 to-cyan-300" },
    { text: "Support client multicanal 24/7", icon: Headphones, color: "from-purple-400 to-pink-300" },
    { text: "Télésecrétaire médical spécialisé", icon: Shield, color: "from-green-400 to-emerald-300" },
    { text: "Gestion de projet digital", icon: Target, color: "from-orange-400 to-red-300" },
  ];

  const stats = [
    { number: "500+", label: "Clients satisfaits", icon: Star },
    { number: "24/7", label: "Support disponible", icon: Clock },
    { number: "98%", label: "Taux de satisfaction", icon: Award },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Vidéo d'arrière-plan locale */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className="w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: videoLoaded ? 0.8 : 0 }}
        >
          <source src="/videos/3255275-uhd_3840_2160_25fps.mp4" type="video/mp4" />
          <source src="/videos/hero-background.webm" type="video/webm" />
        </video>
        
        {/* Image de fallback avec effet parallax */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          style={{ opacity: videoLoaded ? 0 : 1 }}
        />
        
        {/* Overlay sophistiqué multi-couches */}
        <div className="absolute inset-0 bg-gradient-to-r from-black from-7% via-transparent via-100% to-pink-900/60 to-10%" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
        
        {/* Effet de particules lumineuses */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/30 animate-pulse"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 relative z-10 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Colonne gauche - Contenu principal */}
            <div className="text-left">
              {/* Badge de présentation */}
              <div 
                className={`inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm text-white mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
              >
                <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                Solution d'assistance virtuelle premium
              </div>

              {/* Titre principal avec effet de typing */}
              <h1 
                className={`text-5xl md:text-7xl font-black mb-6 leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <span className="text-white block">VILO</span>
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent block">
                  ASSIST-PRO
                </span>
              </h1>

              {/* Sous-titre dynamique */}
              <p 
                className={`text-xl md:text-2xl text-gray-200 mb-8 max-w-xl transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                Transformez votre productivité avec notre{' '}
                <span className="text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text font-semibold">
                  assistance virtuelle intelligente
                </span>
              </p>

              {/* Services rotatifs améliorés */}
              <div 
                className={`h-20 mb-10 overflow-hidden transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              >
                <div 
                  className="transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateY(-${currentServiceIndex * 5}rem)` }}
                >
                  {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <div key={index} className="flex items-center h-20 py-2">
                        <div className="flex items-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-xl">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${service.color} mr-4`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-white font-semibold text-lg">
                            {service.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Boutons d'action */}
              <div 
                className={`flex flex-col sm:flex-row gap-4 mb-8 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <button
                  onClick={scrollToContact}
                  className="relative px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center justify-center">
                    Démarrer maintenant
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </button>

                {/* <button className="relative px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300 group">
                  <span className="relative flex items-center justify-center">
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Voir la démonstration
                  </span>
                </button> */}
              </div>

              {/* Statistiques - Alignées horizontalement */}
              <div 
                className={`flex justify-between gap-2 sm:gap-4 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center bg-white/10 backdrop-blur-md px-3 sm:px-4 py-3 rounded-xl border border-white/20 flex-1 min-w-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-2 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-white font-bold text-sm sm:text-lg">{stat.number}</div>
                        <div className="text-gray-300 text-xs sm:text-sm truncate">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Colonne droite - Élément visuel interactif amélioré */}
            <div className={`relative transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="relative">
                {/* Nouveaux cercles décoratifs avec effets de lumière */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-spin-slow" />
                  <div className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-500/15 animate-spin-reverse" />
                  <div className="absolute w-48 h-48 rounded-full bg-gradient-to-tl from-yellow-500/20 to-amber-500/20 animate-pulse" />
                  
                  {/* Particules flottantes */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                      style={{
                        width: `${Math.random() * 8 + 4}px`,
                        height: `${Math.random() * 8 + 4}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float${Math.random() > 0.5 ? '-reverse' : ''} ${Math.random() * 10 + 5}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 5}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Bloc "Pourquoi nous choisir ?" - Version améliorée */}
                <div className="relative z-10 bg-gradient-to-br from-white/5 to-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl overflow-hidden group">
                  {/* Effet de lumière intérieur */}
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
                  
                  {/* Contenu principal avec entrée animée */}
                  <div className="relative z-10">
                    <div className="text-center mb-8">
                      <h3 className="text-white font-bold text-3xl mb-4 relative inline-block">
                        <span className="relative z-10">
                          Pourquoi nous choisir ?
                          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                        </span>
                        <Sparkles className="absolute -top-4 -right-6 w-6 h-6 text-yellow-400 animate-sparkle" />
                      </h3>
                      <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full mb-2" />
                      <p className="text-sm text-white/80">Les raisons de notre excellence</p>
                    </div>
                    
                    {/* Points d'avantages améliorés */}
                    <div className="space-y-5 text-left">
                      {[
                        { 
                          text: 'Expertise et sérieux reconnus', 
                          icon: Award,
                          color: 'from-purple-500 to-pink-500'
                        },
                        { 
                          text: 'Sens de la confidentialité irréprochable', 
                          icon: Shield,
                          color: 'from-blue-500 to-cyan-500'
                        },
                        { 
                          text: 'Service flexible et sur mesure', 
                          icon: Zap,
                          color: 'from-yellow-500 to-amber-500'
                        },
                        { 
                          text: 'Excellent rapport qualité-prix', 
                          icon: CheckCircle,
                          color: 'from-green-500 to-emerald-500'
                        }
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div 
                            key={index} 
                            className="flex items-start space-x-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group-hover-item cursor-pointer"
                          >
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} flex-shrink-0 transform group-hover-item:scale-110 transition-transform duration-300`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white text-base font-medium group-hover-item:text-cyan-100 transition-colors duration-300">
                              {item.text}
                            </span>
                            <ArrowRight className="ml-auto w-4 h-4 text-white/50 group-hover-item:text-white group-hover-item:translate-x-1 transition-all duration-300 opacity-0 group-hover-item:opacity-100" />
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Citation avec effet de survol */}
                    <div className="mt-8 pt-6 border-t border-white/20 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                      <p className="font-semibold italic text-center text-white/90 hover:text-white transition-colors duration-300">
                        <span className="text-2xl text-pink-400 hover:text-yellow-300 transition-colors duration-300">"</span>
                        Vous ne cherchez pas plus, vous cherchez mieux. Faites le bon choix avec 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold hover:from-pink-400 hover:to-purple-400 transition-all duration-500">
                          {' '}Vilo Assist-Pro!
                        </span>
                        <span className="text-2xl text-pink-400 hover:text-yellow-300 transition-colors duration-300">"</span>
                      </p>
                      <div className="flex justify-center mt-4">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="w-4 h-4 text-yellow-400 fill-current animate-pulse" 
                              style={{ animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Effet de bordure animée */}
                  <div className="absolute inset-0 rounded-3xl p-[2px] pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl animate-rotate-border opacity-70" style={{ animationDuration: '8s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Effets de lumière en mouvement */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow" />
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(20px) translateX(-10px); }
        }
        @keyframes rotate-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 8s ease-in-out infinite;
        }
        .animate-rotate-border {
          animation: rotate-border linear infinite;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          padding: 2px;
        }
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        .group-hover-item:hover {
          transform: translateX(5px);
        }
      `}</style>
    </section>
  );
};

export default HeroSection;