import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ServicesSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', () => {
        setIsVideoLoaded(true);
        video.play().catch(e => console.log("Auto-play prevented", e));
      });
    }

    return () => {
      if (video) {
        video.removeEventListener('loadeddata', () => {});
      }
    };
  }, []);

  const services = [
    {
      icon: "📄",
      gradient: "from-blue-400 to-blue-600",
      backgroundImage: "https://picsum.photos/400/300?random=1",
      title: "Assistant administratif",
      description: "Gestion de vos tâches administratives quotidiennes avec rigueur et efficacité."
    },
    {
      icon: "💼",
      gradient: "from-indigo-400 to-purple-600",
      backgroundImage: "https://picsum.photos/400/300?random=2",
      title: "Assistant polyvalent",
      description: "Support complet pour diverses missions selon vos besoins spécifiques."
    },
    {
      icon: "✅",
      gradient: "from-green-400 to-emerald-600",
      backgroundImage: "https://picsum.photos/400/300?random=3",
      title: "Assistant recrutement",
      description: "Accompagnement dans vos processus de recrutement et sélection de candidats."
    },
    {
      icon: "🏨",
      gradient: "from-amber-400 to-orange-600",
      backgroundImage: "https://picsum.photos/400/300?random=4",
      title: "Assistant virtuel en conciergerie",
      description: "Services de conciergerie personnalisés pour vos clients et partenaires."
    },
    {
      icon: "🔍",
      gradient: "from-cyan-400 to-teal-600",
      backgroundImage: "https://picsum.photos/400/300?random=5",
      title: "Téléprospecteurs à distance",
      description: "Prospection commerciale efficace pour développer votre clientèle."
    },
    {
      icon: "🎧",
      gradient: "from-purple-400 to-pink-600",
      backgroundImage: "https://picsum.photos/400/300?random=6",
      title: "Support client",
      description: "Assistance et accompagnement de vos clients avec professionnalisme."
    },
    {
      icon: "📞",
      gradient: "from-red-400 to-rose-600",
      backgroundImage: "https://picsum.photos/400/300?random=7",
      title: "Standardiste téléphonique",
      description: "Accueil téléphonique professionnel et gestion de vos appels."
    },
    {
      icon: "🧮",
      gradient: "from-yellow-400 to-orange-600",
      backgroundImage: "https://picsum.photos/400/300?random=8",
      title: "Gestion financière en pré-compta",
      description: "Préparation et organisation de vos documents comptables."
    },
    {
      icon: "🩺",
      gradient: "from-emerald-400 to-green-600",
      backgroundImage: "https://picsum.photos/400/300?random=9",
      title: "Télésecrétaire médical",
      description: "Secrétariat spécialisé pour les professionnels de santé."
    },
    {
      icon: "⚖️",
      gradient: "from-slate-400 to-gray-600",
      backgroundImage: "https://picsum.photos/400/300?random=10",
      title: "Télésecrétaire juridique",
      description: "Support administratif spécialisé pour le secteur juridique."
    },
    {
      icon: "💾",
      gradient: "from-violet-400 to-purple-600",
      backgroundImage: "https://picsum.photos/400/300?random=11",
      title: "Saisie de données",
      description: "Saisie précise et rapide de vos données importantes."
    },
    {
      icon: "🎙️",
      gradient: "from-pink-400 to-red-600",
      backgroundImage: "https://picsum.photos/400/300?random=12",
      title: "Transcripteur audio et vidéo",
      description: "Transcription professionnelle de vos contenus audio et vidéo."
    }
  ];

  const Icon3D = ({ emoji, gradient }) => (
    <div className={`relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-2xl`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
      
      <span 
        className="text-2xl filter drop-shadow-lg transform transition-transform duration-300 group-hover:scale-110"
        style={{
          textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.2)'
        }}
      >
        {emoji}
      </span>
      
      <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full blur-sm"></div>
    </div>
  );

  return (
    <section id="services" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-20 dark:opacity-10 transition-opacity duration-1000"
          style={{ opacity: isVideoLoaded ? 0.2 : 0 }}
        >
          <source src="/videos/2759477-uhd_3840_2160_30fps.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas les vidéos HTML5.
        </video>
        
        {!isVideoLoaded && (
          <img
            src="/images/fallback-bg.jpg"
            alt="Background fallback"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-white/90 dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/90"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-vilo-purple-600 to-vilo-pink-600 dark:from-vilo-purple-400 dark:to-vilo-pink-400 bg-clip-text text-transparent">
            Nos Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Notre équipe expérimentée vous propose des prestations sur mesure, dans des domaines variés. 
            Nous ciblons les PME, les entrepreneurs, les professionnels occupés qui veulent optimiser leur temps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-500 border-vilo-purple-100 dark:border-vilo-purple-700 hover:border-vilo-purple-300 dark:hover:border-vilo-purple-500 hover:-translate-y-2 dark:bg-gray-800/80 bg-white/80 backdrop-blur-sm transform hover:rotate-1 relative overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                style={{ 
                  backgroundImage: `url(${service.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-white/50 dark:from-gray-800/80 dark:to-gray-900/70"></div>
              <CardHeader className="text-center relative z-10">
                <Icon3D emoji={service.icon} gradient={service.gradient} />
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-vilo-purple-700 dark:group-hover:text-vilo-purple-300 transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-vilo-purple-50 to-vilo-pink-50 dark:from-vilo-purple-900/30 dark:to-vilo-pink-900/30 rounded-2xl p-8 max-w-4xl mx-auto backdrop-blur-sm border border-vilo-purple-200 dark:border-vilo-purple-700/50">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Faire appel à nous, c'est bénéficier :
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-vilo-purple-500 to-vilo-pink-500 rounded-xl mx-auto flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-lg drop-shadow-lg">1</span>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">Service fiable</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Expertise reconnue depuis plus de 5 ans</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-vilo-purple-500 to-vilo-pink-500 rounded-xl mx-auto flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-lg drop-shadow-lg">2</span>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">Service flexible</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Adapté à vos besoins spécifiques</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-vilo-purple-500 to-vilo-pink-500 rounded-xl mx-auto flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-white font-bold text-lg drop-shadow-lg">3</span>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">Excellent rapport qualité-prix</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Tarif unique de 10€/heure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;